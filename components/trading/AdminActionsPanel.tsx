"use client";

import { useState } from "react";
import { notification } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/Tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, XCircle, ShieldUser } from "lucide-react";
import clsx from "clsx";
import { useManagementUser } from "@/hooks/useManagementUser";
import { useModal } from "@/context/ModalContext";
import {
  setTransactionFailed,
  retryTransactionAdmin,
} from "@/api/adminTransactionActions";

interface Props {
  trxNo: string;
  trxType: "buy" | "sell" | string;
  status?: string;
  onChanged?: () => void;
}

// Statuses where neither Retry nor Set Failed make sense.
const isFinalStatus = (s?: string) => {
  const v = (s || "").toLowerCase().trim();
  return v === "completed" || v === "success" || v === "refunded" || v === "cancelled";
};

const isAlreadyFailed = (s?: string) => (s || "").toLowerCase().trim() === "failed";

// Allow retry for any non-final state — backend (retryOfframpDepositService /
// retryOnrampSwapService) is the source of truth and will reject if the
// status truly isn't retryable. Being permissive here avoids the case where
// the admin clearly sees a stuck/failed trx but the button is disabled.
const canRetryStatus = (trxType: string, status?: string) => {
  if (trxType !== "sell" && trxType !== "buy") return false;
  return !isFinalStatus(status);
};

const AdminActionsPanel = ({ trxNo, trxType, status, onChanged }: Props) => {
  const { isManagement, adminEmail, isResolving } = useManagementUser();
  const [api, contextHolder] = notification.useNotification();
  const { confirm, delete: confirmDanger, close: closeModal } = useModal();
  const [setFailedNote, setSetFailedNote] = useState("");
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["offramp-transaction", trxNo] });
    queryClient.invalidateQueries({ queryKey: ["transaction-detail", trxNo] });
    queryClient.invalidateQueries({ queryKey: ["management-transaction-detail", trxNo] });
    queryClient.invalidateQueries({ queryKey: ["getTrxByChain"] });
    onChanged?.();
  };

  const retryMutation = useMutation({
    mutationFn: async () => {
      if (!adminEmail) throw new Error("Admin email missing");
      return retryTransactionAdmin(trxNo, { adminEmail });
    },
    onSuccess: () => {
      api.success({ message: "Retry initiated", placement: "topRight" });
      refresh();
    },
    onError: (err: Error) => {
      api.error({ message: "Retry failed", description: err.message, placement: "topRight" });
      throw err; // let the modal stay open & stop loading
    },
  });

  const setFailedMutation = useMutation({
    mutationFn: async (note: string) => {
      if (!adminEmail) throw new Error("Admin email missing");
      return setTransactionFailed(trxNo, { adminEmail, note: note.trim() || undefined });
    },
    onSuccess: () => {
      api.success({ message: "Transaction marked as failed", placement: "topRight" });
      setSetFailedNote("");
      refresh();
    },
    onError: (err: Error) => {
      api.error({ message: "Set failed", description: err.message, placement: "topRight" });
      throw err;
    },
  });

  // Hard gate: never render admin UI until we have *confirmed* management.
  // Hide while resolving and for any user whose affiliate row is not
  // is_management = true. This is paired with backend authorisation
  // (verifyManagementByEmail) — DOM hiding alone is not security.
  if (isResolving || !isManagement || !adminEmail) return null;

  const canRetry = canRetryStatus(trxType, status);
  // Set Failed: blocked when trx is in a final state OR already failed.
  const canSetFailed = !isFinalStatus(status) && !isAlreadyFailed(status);

  const retryDisabledReason = !canRetry
    ? isFinalStatus(status)
      ? `Status "${status}" is final — cannot retry.`
      : `Status "${status || "unknown"}" not retryable.`
    : "";
  const setFailedDisabledReason = isAlreadyFailed(status)
    ? "Transaction is already failed."
    : isFinalStatus(status)
    ? `Cannot fail a ${status} transaction.`
    : "";

  const retryDescription =
    trxType === "buy"
      ? `Reset ${trxNo} (onramp) so the swap scheduler will retry. Mint failures cannot be retried this way — refund instead.`
      : `Reset ${trxNo} (offramp) to retry deposit/swap processing.`;

  const handleRetry = () => {
    confirm({
      title: "Retry transaction?",
      description: retryDescription,
      icon: <RefreshCw className="w-8 h-8 text-[#ECF0EF]" />,
      confirmText: "Retry",
      onConfirm: async () => {
        await retryMutation.mutateAsync();
      },
    });
  };

  const handleSetFailed = () => {
    let noteValue = "";
    confirmDanger({
      title: "Mark as failed?",
      icon: <XCircle className="w-8 h-8 text-[#ECF0EF]" />,
      confirmText: "Confirm",
      description: (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#6A9080] leading-relaxed">
            This will set the status to <span className="text-red-400 font-medium">failed</span>{" "}
            and mark the in-progress step as failed. Use this when a transaction is stuck and you
            want to unblock the admin refund flow.
          </p>
          <textarea
            defaultValue={setFailedNote}
            onChange={(e) => {
              noteValue = e.target.value;
              setSetFailedNote(e.target.value);
            }}
            placeholder="Optional reason / note"
            rows={3}
            className={clsx(
              "w-full rounded-lg px-3 py-2 text-sm resize-none outline-none",
              "bg-white border border-[#1F2740] text-[#003E2C] placeholder:text-[#6B7280]",
              "focus:border-[#CBF23D]/60"
            )}
          />
        </div>
      ),
      onConfirm: async () => {
        await setFailedMutation.mutateAsync(noteValue);
      },
    });
  };

  // Silence unused warnings for closeModal — kept available for future flows
  void closeModal;

  return (
    <>
      {contextHolder}
      <div
        className={clsx(
          "w-full max-w-[454px] mx-auto rounded-3xl py-3 px-4",
          "bg-[#ECF0EF]/15"
        )}
      >
        <div className="flex items-center mb-3">
          <div
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center p-1.5 relative mr-3",
              "bg-white"
            )}
          >
            <ShieldUser className="text-xl text-[#FFB020]" />
          </div>
          <div className="text-[#003E2C] text-sm flex-1 min-w-0">
            <div className="font-medium flex items-center gap-2">
              Admin Actions
              {status && (
                <span className="px-2 py-0.5 rounded-md bg-white text-[10px] uppercase tracking-wide text-[#6A9080] font-mono">
                  {status}
                </span>
              )}
            </div>
            <div className="text-xs text-[#6A9080] font-light truncate">{trxNo}</div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Tooltip title={retryDisabledReason || ""}>
            <button
              type="button"
              disabled={!canRetry || retryMutation.isPending}
              onClick={handleRetry}
              className={clsx(
                "flex-1 min-w-[120px] font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm",
                "border border-solid border-[#CBF23D] text-[#003E2C] hover:bg-[#CBF23D]/10",
                "disabled:border-[#C2CFCB] disabled:text-[#6A9080] disabled:bg-transparent disabled:cursor-not-allowed"
              )}
            >
              <RefreshCw size={16} />
              {retryMutation.isPending ? "Retrying..." : "Retry"}
            </button>
          </Tooltip>

          <Tooltip title={setFailedDisabledReason}>
            <button
              type="button"
              disabled={!canSetFailed || setFailedMutation.isPending}
              onClick={handleSetFailed}
              className={clsx(
                "flex-1 min-w-[120px] font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm",
                "border border-solid border-red-500 text-[#003E2C] hover:bg-red-500/10",
                "disabled:border-[#C2CFCB] disabled:text-[#6A9080] disabled:bg-transparent disabled:cursor-not-allowed"
              )}
            >
              <XCircle size={16} />
              Set Failed
            </button>
          </Tooltip>
        </div>

        {!canRetry && retryDisabledReason && (
          <p className="text-xs text-[#6A9080] font-light mt-2">{retryDisabledReason}</p>
        )}
      </div>
    </>
  );
};

export default AdminActionsPanel;

/**
 * Lightweight gate: only mounts AdminActionsPanel when:
 *   1. The URL contains `?is_management=true` (explicit opt-in), AND
 *   2. The current user is confirmed as a management admin.
 *
 * The query param is required because admin and end-user may use the
 * same browser; without it the panel would leak admin actions to the
 * regular user. Admin clicks "View" from the management table which
 * appends the param.
 */
export const AdminActionsPanelGate = (props: Props) => {
  const { isManagement, isResolving } = useManagementUser();
  const isManagementMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("is_management") === "true";

  if (!isManagementMode) return null;
  if (isResolving || !isManagement) return null;
  return <AdminActionsPanel {...props} />;
};
