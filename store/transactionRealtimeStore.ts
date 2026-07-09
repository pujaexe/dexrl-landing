import { create } from "zustand";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export interface HistoryTransactionRealtime {
  id?: string;
  trx_no: string;
  status: string;
  tx_hash?: string | null;
  [key: string]: any;
}

type TxCallback = (tx: HistoryTransactionRealtime, eventType: string) => void;

interface TransactionRealtimeState {
  isConnected: boolean;
  subscribe: (trxNo: string, callback: TxCallback) => () => void;
}

// Singleton Supabase channel + callback registry (per trx_no)
let channel: RealtimeChannel | null = null;
const callbacksByTrx = new Map<string, Set<TxCallback>>();
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 3000;

function setupChannel(set: (s: Partial<TransactionRealtimeState>) => void) {
  if (channel) {
    return;
  }

  const channelName = "history_transaction_changes_singleton";
  console.log("📡 REALTIME: Creating history_transaction channel:", channelName);

  channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "history_transaction",
      },
      (payload: any) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        const tx = (newRecord || oldRecord) as HistoryTransactionRealtime | undefined;
        const trxNo = tx?.trx_no;

        if (!trxNo || !tx) {
          return;
        }

        const callbacks = callbacksByTrx.get(trxNo);
        if (!callbacks || callbacks.size === 0) {
          return;
        }

        console.log("🔔 REALTIME TX UPDATE:", {
          eventType,
          trx_no: trxNo,
          oldStatus: oldRecord?.status,
          newStatus: newRecord?.status,
          txHash: newRecord?.tx_hash ?? oldRecord?.tx_hash,
        });

        callbacks.forEach((cb) => {
          try {
            cb(tx, eventType);
          } catch (err) {
            console.error("❌ Realtime tx callback error:", err);
          }
        });
      }
    )
    .subscribe((status, err) => {
      console.log("📡 REALTIME history_transaction status:", status, err ? `Error: ${err}` : "");
      set({ isConnected: status === "SUBSCRIBED" });

      if (status === "SUBSCRIBED") {
        // Reset reconnect attempts on successful connection
        reconnectAttempts = 0;
      } else if (status === "TIMED_OUT" || status === "CHANNEL_ERROR" || status === "CLOSED") {
        console.warn(`⚠️ REALTIME history_transaction ${status}`, err);

        // Attempt to reconnect if we have subscribers
        if (callbacksByTrx.size > 0 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`🔄 REALTIME: Attempting reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${RECONNECT_DELAY_MS}ms...`);

          // Clear any existing timeout
          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
          }

          reconnectTimeout = setTimeout(() => {
            // Clean up old channel
            if (channel) {
              supabase.removeChannel(channel);
              channel = null;
            }
            // Reconnect
            setupChannel(set);
          }, RECONNECT_DELAY_MS);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error("❌ REALTIME: Max reconnect attempts reached");
        }
      }
    });
}

export const useTransactionRealtimeStore = create<TransactionRealtimeState>((set) => ({
  isConnected: false,

  subscribe: (trxNo: string, callback: TxCallback) => {
    if (!trxNo) {
      throw new Error("trxNo is required for realtime subscription");
    }

    setupChannel(set);

    let setForTrx = callbacksByTrx.get(trxNo);
    if (!setForTrx) {
      setForTrx = new Set();
      callbacksByTrx.set(trxNo, setForTrx);
    }
    setForTrx.add(callback);

    console.log("📡 Subscribed to realtime tx:", trxNo, "callbacks:", setForTrx.size);

    // Unsubscribe function
    return () => {
      const current = callbacksByTrx.get(trxNo);
      if (current) {
        current.delete(callback);
        if (current.size === 0) {
          callbacksByTrx.delete(trxNo);
        }
      }

      console.log("🧹 Unsubscribed from realtime tx:", trxNo);

      // Optional: if no more callbacks at all, we could tear down the channel
      if (callbacksByTrx.size === 0 && channel) {
        console.log("🧹 No more subscribers, removing history_transaction channel");
        // Clear any pending reconnect timeout
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
        reconnectAttempts = 0;
        supabase.removeChannel(channel);
        channel = null;
        set({ isConnected: false });
      }
    };
  },
}));

