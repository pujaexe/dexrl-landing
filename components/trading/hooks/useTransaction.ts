"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatchTransactionProgressRequest } from "../WidgetPayment/WidgetPayment.types";
import { useParams } from "@/lib/router-compat";
import { patchTransactionProgress, updateUserTransaction, type IParamUpdateUserTransaction } from "@/api/transactionService";

const useTransaction = () => {
    const queryClient = useQueryClient();
    const { tx_no = "" } = useParams();

    const updateProgressMutation = useMutation({
        mutationFn: (progress: PatchTransactionProgressRequest) =>
            patchTransactionProgress(tx_no, progress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transaction', tx_no] });
        }
    });

    const updateTransactionMutation = useMutation({
        mutationFn: (data: IParamUpdateUserTransaction) =>
            updateUserTransaction(tx_no, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transaction', tx_no] });
        }
    });

    const updateTransactionProgress = (code: string, status: string) => {
        updateProgressMutation.mutate({
            code: code,
            status: status
        })
    }

    const updateTransactionProgressAsync = async (code: string, status: string) => {
        await updateProgressMutation.mutateAsync({
            code: code,
            status: status
        })
    }

    const updateTransaction = (data: IParamUpdateUserTransaction) => {
        updateTransactionMutation.mutate(data)
    }

    const updateTransactionAsync = async (data: IParamUpdateUserTransaction) => {
        await updateTransactionMutation.mutateAsync(data)
    }

    return {
        updateTransactionProgress,
        updateTransaction,
        updateTransactionAsync,
        updateTransactionProgressAsync
    };
};

export default useTransaction;