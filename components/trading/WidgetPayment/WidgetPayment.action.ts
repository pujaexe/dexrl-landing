"use client";

import { getTransaction } from "@/services/transactionService";
import { useTradingFormStore } from "@/store/tradingFormStore";
import { useTransactionRealtimeStore } from "@/store/transactionRealtimeStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "@/lib/router-compat";
import type { TransactionData } from "./WidgetPayment.types";

const useWidgetPaymentAction = () => {
  const { tx_no = "" } = useParams();
  const { onOpenModalSuccess } = useTradingFormStore();
  const { subscribe } = useTransactionRealtimeStore();

  const {
    data: transactionData,
    isLoading: isLoadingTransaction,
    error: errorTransaction,
    refetch: refetchTransaction,
  } = useQuery<TransactionData>({
    queryKey: ["transaction", tx_no],
    queryFn: () => getTransaction(tx_no),
    enabled: !!tx_no,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    const transactionStatus = transactionData?.status;
    console.log('📊 Transaction status:', transactionStatus);
    console.log('tx_hash', transactionData?.tx_hash);
    console.log('tx_no', tx_no);
    if (!tx_no || !transactionData) return;

    if (transactionStatus === "completed") {
      onOpenModalSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx_no, transactionData]);

  useEffect(() => {
    if (!tx_no) return;
    const unsubscribe = subscribe(tx_no, (tx, eventType) => {
      console.log("🔔 Realtime history_transaction update:", {
        eventType,
        trx_no: tx.trx_no,
        status: tx.status,
        tx_hash: tx.tx_hash,
      });

      if (tx.status === "completed" && !transactionData?.show_completed) {
        onOpenModalSuccess();
      }
      refetchTransaction();
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx_no]);

  return {
    transactionData,
    isLoadingTransaction,
    errorTransaction,
  };
};

export default useWidgetPaymentAction;
