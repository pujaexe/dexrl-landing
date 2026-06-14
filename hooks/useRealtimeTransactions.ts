import { useEffect, useState, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

// Interface untuk transaction
interface MintTransaction {
  id: string;
  payment_ref: string;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

// Global singleton state untuk prevent multiple instances
let globalChannel: RealtimeChannel | null = null;
let globalIsConnected = false;
const globalPendingTransactions = new Map<string, MintTransaction>();
let instanceCount = 0;

// Custom hook untuk realtime transactions
export const useRealtimeTransactions = () => {
  const [pendingTransactions] = useState(() => globalPendingTransactions);
  const [isConnected, setIsConnected] = useState(globalIsConnected);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const callbacksRef = useRef<
    ((transaction: MintTransaction, eventType: string) => void)[]
  >([]);

  // Track pending transaction
  const trackPendingTransaction = (transaction: MintTransaction) => {
    if (transaction.payment_ref) {
      globalPendingTransactions.set(transaction.payment_ref, transaction);
      console.log(
        "🎯 TRACKING:",
        transaction.payment_ref,
        `(${globalPendingTransactions.size} total)`
      );
    } else {
      console.error("❌ Cannot track: no payment_ref!", transaction);
    }
  };

  // Untrack transaction
  const untrackTransaction = (paymentRef: string) => {
    globalPendingTransactions.delete(paymentRef);
    console.log(
      "🔄 UNTRACKED:",
      paymentRef,
      `(${globalPendingTransactions.size} remaining)`
    );
  };

  // Check if has pending transaction
  const hasPendingTransaction = (paymentRef: string): boolean => {
    console.log("globalPendingTransactions", globalPendingTransactions);
    return globalPendingTransactions.has(paymentRef);
  };

  // Get pending transaction
  const getPendingTransaction = (
    paymentRef: string
  ): MintTransaction | undefined => {
    return globalPendingTransactions.get(paymentRef);
  };

  // Handle database changes
  const handleDatabaseChange = (payload: any) => {
    console.log("🔄 HANDLING DATABASE CHANGE - START");

    setLastUpdate(new Date());
    const { eventType, new: newRecord, old: oldRecord } = payload;

    const paymentRef = newRecord?.payment_ref || oldRecord?.payment_ref;

    // DEBUG: Detailed logging
    console.log("📊 CHANGE DETAILS:", {
      eventType,
      paymentRef,
      newStatus: newRecord?.status,
      oldStatus: oldRecord?.status,
      pendingCount: globalPendingTransactions.size,
      pendingKeys: Array.from(globalPendingTransactions.keys()),
      isTracked: paymentRef ? hasPendingTransaction(paymentRef) : false,
    });

    // DEBUG: Cek apakah payment_ref yang diupdate adalah yang kita track
    if (paymentRef) {
      const isTracked = hasPendingTransaction(paymentRef);
      console.log(`🔍 Payment ref "${paymentRef}" is tracked: ${isTracked}`);

      if (!isTracked) {
        console.log("⚠️ This payment_ref is not in our tracking list!");
        console.log(
          "🔍 Available tracking keys:",
          Array.from(globalPendingTransactions.keys())
        );
        // Cek similarity
        const similarKeys = Array.from(globalPendingTransactions.keys()).filter(
          (key) =>
            key.includes(paymentRef.slice(0, 5)) ||
            paymentRef.includes(key.slice(0, 5))
        );
        if (similarKeys.length > 0) {
          console.log("🔍 Similar keys found:", similarKeys);
        }
      }
    }

    switch (eventType) {
      case "UPDATE":
        if (paymentRef && hasPendingTransaction(paymentRef)) {
          if (oldRecord?.status !== newRecord?.status) {
            console.log("✅ STATUS CHANGE DETECTED and TRACKED!");
            console.log(`📈 Status: ${oldRecord.status} → ${newRecord.status}`);

            emitTransactionUpdate(newRecord, "status_changed");
          } else {
            console.log("ℹ️ Update but no status change");
          }
        } else {
          console.log(
            "❌ Update not processed - not tracked or no payment_ref"
          );
        }
        break;

      case "INSERT":
        console.log("📝 INSERT event");
        if (
          newRecord?.payment_ref &&
          hasPendingTransaction(newRecord.payment_ref)
        ) {
          console.log("✅ INSERT for tracked transaction");
          emitTransactionUpdate(newRecord, "inserted");
        }
        break;

      case "DELETE":
        console.log("🗑️ DELETE event");
        if (
          oldRecord?.payment_ref &&
          hasPendingTransaction(oldRecord.payment_ref)
        ) {
          console.log("✅ DELETE for tracked transaction");
          emitTransactionUpdate(oldRecord, "deleted");
        }
        break;
    }

    console.log("🔄 HANDLING DATABASE CHANGE - END");
  };

  // Emit transaction update
  const emitTransactionUpdate = (
    transaction: MintTransaction,
    eventType: string
  ) => {
    console.log("📢 EMITTING UPDATE:");
    console.log("   Transaction:", transaction);
    console.log("   Event Type:", eventType);
    console.log("   Callback Count:", callbacksRef.current.length);

    if (callbacksRef.current.length === 0) {
      console.error("❌ NO CALLBACKS TO EMIT TO!");
      return;
    }

    callbacksRef.current.forEach((callback, index) => {
      try {
        console.log(`📞 Calling callback ${index + 1}`);
        callback(transaction, eventType);
        console.log(`✅ Callback ${index + 1} completed`);
      } catch (error) {
        console.error(`❌ Callback ${index + 1} error:`, error);
      }
    });
  };

  // Register callback untuk transaction updates
  const onTransactionUpdate = (
    callback: (transaction: MintTransaction, eventType: string) => void
  ) => {
    if (!callbacksRef.current.includes(callback)) {
      callbacksRef.current.push(callback);
      console.log(
        "🔔 CALLBACK: Registered new callback",
        `(${callbacksRef.current.length} total)`
      );
    }

    // Return cleanup function
    return () => {
      const index = callbacksRef.current.indexOf(callback);
      if (index !== -1) {
        callbacksRef.current.splice(index, 1);
        console.log(
          "🧹 CALLBACK: Unregistered callback",
          `(${callbacksRef.current.length} remaining)`
        );
      }
    };
  };

  // Setup realtime subscription
  const setupRealtimeSubscription = () => {
    if (globalChannel) {
      console.log(
        "📡 REALTIME: Using existing global channel, state:",
        globalChannel.state
      );
      return;
    }

    console.log("🔄 REALTIME: Setting up NEW global subscription");

    const channelName = "idrx_requests_changes_singleton";
    console.log("📡 REALTIME: Creating global channel:", channelName);

    globalChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "idrx_request",
        },
        (payload: any) => {
          console.log("🎯 REALTIME EVENT RECEIVED:", {
            eventType: payload.eventType,
            payment_ref: payload.new?.payment_ref || payload.old?.payment_ref,
            oldStatus: payload.old?.status,
            newStatus: payload.new?.status,
            timestamp: new Date().toLocaleTimeString(),
            callbackCount: callbacksRef.current.length, // DEBUG: Cek berapa callback
          });

          // DEBUG: Log full payload structure
          console.log("📋 FULL PAYLOAD:", JSON.stringify(payload, null, 2));

          handleDatabaseChange(payload);
        }
      )
      .subscribe((status, err) => {
        console.log("📡 REALTIME STATUS:", status, err ? `Error: ${err}` : "");

        globalIsConnected = status === "SUBSCRIBED";
        setIsConnected(globalIsConnected);

        if (status === "SUBSCRIBED") {
          console.log("✅ REALTIME: Global connection established");
          console.log(
            "📊 Active channels:",
            supabase.realtime?.channels?.length
          );
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ REALTIME: Connection error", err);
        } else if (status === "CLOSED") {
          console.warn("⚠️ REALTIME: Connection closed");
        }
      });
  };

  // Cleanup function
  const cleanup = () => {
    instanceCount--;
    console.log(
      "🔄 REALTIME: Instance cleanup",
      `(${instanceCount} remaining)`
    );
    console.trace("🔍 CLEANUP CALLED FROM:"); // Lihat dari mana cleanup dipanggil

    if (instanceCount <= 0 && globalChannel) {
      console.log("🔍 Cleaning up global realtime subscription");
      console.log("🔍 Channel state before cleanup:", globalChannel.state);

      supabase.removeChannel(globalChannel);
      globalChannel = null;
      globalIsConnected = false;
      setIsConnected(false);
      instanceCount = 0;

      // Clear callbacks when cleaning up
      console.log("🧹 Clearing all callbacks during cleanup");
    }
  };

  useEffect(() => {
    instanceCount++;
    console.log("🔄 REALTIME: Instance created", `(${instanceCount} total)`);
    console.trace("🔍 INSTANCE CREATED FROM:"); // Lihat dari mana instance dibuat

    setupRealtimeSubscription();

    return () => {
      cleanup();
    };
  }, []);

  return {
    // State
    pendingTransactions,
    isConnected,
    lastUpdate,
    pendingCount: pendingTransactions.size,

    // Methods
    trackPendingTransaction,
    untrackTransaction,
    hasPendingTransaction,
    getPendingTransaction,
    onTransactionUpdate,
  };
};
