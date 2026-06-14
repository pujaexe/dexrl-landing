"use client";

import { getOfframpTransaction, getOfframpDepositStatus, cancelOfframpTransaction, retryOfframpDeposit } from "@/api/offrampService";
import { transferTokenToSWC } from "@/helper/smartAccountHelper";
import { useModal } from "@/context/ModalContext";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useTradingFormStore } from "@/store/tradingFormStore";
import { useTransactionRealtimeStore } from "@/store/transactionRealtimeStore";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";
import { parseUnits } from "viem";
import type {
    OfframpMode,
    OfframpTransactionData,
} from "./WidgetOfframp.types";
import { Iconify } from "@/components/icon/Iconify";

const useWidgetOfframpAction = () => {
    const { txNo = "" } = useParams();
    const navigate = useNavigate();
    const { wallet, loginSession } = useTradingAuthStore();
    const { onOpenModalSuccess } = useTradingFormStore();
    const { subscribe } = useTransactionRealtimeStore();
    const { information, close } = useModal();
    const hasExecutedRef = useRef(false);
    const [depositConfirmed, setDepositConfirmed] = useState(false);
    const [isConfirmingDeposit, setIsConfirmingDeposit] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionError, setExecutionError] = useState<string | null>(null);

    const loginProvider = loginSession?.provider || ""; // "google" | "metamask"

    // Determine UI mode based on login provider and deposit status
    const uiMode: OfframpMode =
        loginProvider === "google" && !depositConfirmed
            ? "deposit_instruction"
            : "redemption_process";

    const {
        data: transactionResponse,
        isLoading: isLoadingTransaction,
        error: errorTransaction,
        refetch: refetchTransaction,
    } = useQuery({
        queryKey: ["offramp-transaction", txNo],
        queryFn: () => getOfframpTransaction(txNo),
        enabled: !!txNo,
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
        refetchInterval: depositConfirmed ? false : 5000, // Poll every 5s while waiting for deposit
    });

    // Extract transaction data from response
    const transactionData = transactionResponse?.data as OfframpTransactionData | undefined;

    // Handle deposit check for Google flow ("I've Paid" button)
    // Only checks if deposit has been received, does not update order status
    // Order status updates are handled automatically by the scheduler
    const handleDepositConfirmed = useCallback(async () => {
        setIsConfirmingDeposit(true);
        try {
            const response = await getOfframpDepositStatus(txNo);
            const depositStatus = response?.data?.status;

            // Check if deposit has been detected or confirmed
            if (depositStatus === "DETECTED" || depositStatus === "CONFIRMED") {
                // Show success modal with checkmark icon
                information({
                    icon: <Iconify name="mdi:check-circle" className="text-green-500 text-4xl" />,
                    title: "Deposit Detected",
                    description: (
                        <div className="flex flex-col gap-2 w-full text-center">
                            <p className="text-[#003E2C]">
                                Your deposit has been successfully detected!
                            </p>
                        </div>
                    ),
                });

                // Close modal after 1 second
                setTimeout(() => {
                    close();
                }, 1000);

                setDepositConfirmed(true);
                await refetchTransaction();
            } else {
                // Deposit not received yet, show information modal
                information({
                    icon: <Iconify name="jam:refresh-reverse" className="text-[#003E2C] text-4xl animate-[spin_2s_linear_infinite]" />,
                    title: "Deposit Not Received",
                    description: (
                        <div className="flex flex-col gap-2 w-full text-center">
                            <p className="text-[#003E2C]">
                                We haven't detected your deposit yet.
                            </p>
                            <p className="text-sm text-[#6A9080]">
                                Please make sure you have sent the exact amount to the deposit address.
                                It may take a few minutes for the transaction to be confirmed on the blockchain.
                            </p>
                        </div>
                    ),
                });
            }
        } catch (error) {
            console.error("Failed to check deposit status:", error);
            information({
                title: "Error",
                description: (
                    <p className="text-[#003E2C] text-center">
                        Failed to check deposit status. Please try again.
                    </p>
                ),
            });
        } finally {
            setIsConfirmingDeposit(false);
        }
    }, [txNo, refetchTransaction, information, close]);

    // Execute deposit for Metamask users (transfer to deposit address, backend handles swap)
    const executeOfframpTransaction = useCallback(async () => {
        if (hasExecutedRef.current) return;
        if (!wallet?.eoaAddress) return;
        if (!transactionData) return;

        const depositAddress = transactionData.deposit_address?.address;
        if (!depositAddress) {
            setExecutionError("Deposit address not available");
            return;
        }

        hasExecutedRef.current = true;
        setIsExecuting(true);
        setExecutionError(null);

        const { from_token, from_chain, amount_token } = transactionData;
        const fromChainId = from_chain?.chain_id;
        const fromTokenAddress = from_token?.token_address;
        const fromTokenDecimals = from_token?.token_decimals || 18;

        if (!fromChainId || !fromTokenAddress) {
            setExecutionError("Invalid transaction data");
            setIsExecuting(false);
            return;
        }

        try {
            const fromAmountBigInt = parseUnits(
                amount_token.toString(),
                fromTokenDecimals
            );
            console.log("[Offramp] Starting deposit transfer, amount:", fromAmountBigInt.toString());
            console.log("[Offramp] From EOA:", wallet.eoaAddress);
            console.log("[Offramp] To Deposit Address:", depositAddress);

            // Transfer tokens from EOA (MetaMask) to deposit address
            // Backend poller will detect the deposit and handle the swap
            await transferTokenToSWC(
                fromChainId,
                wallet.eoaAddress as `0x${string}`,
                depositAddress as `0x${string}`,
                fromTokenAddress as `0x${string}`,
                fromAmountBigInt
            );

            console.log("[Offramp] Deposit transfer completed, backend will handle the swap");
            await refetchTransaction();
        } catch (error: any) {
            console.error("Offramp deposit failed:", error);

            // Check if user rejected/cancelled the transaction in MetaMask
            const isUserRejected =
                error?.code === 4001 ||
                error?.message?.toLowerCase().includes("user rejected") ||
                error?.message?.toLowerCase().includes("user denied") ||
                error?.message?.toLowerCase().includes("rejected by user") ||
                error?.shortMessage?.toLowerCase().includes("user rejected");

            if (isUserRejected) {
                // Cancel the transaction and navigate back to trading widget
                try {
                    await cancelOfframpTransaction(txNo);
                } catch (cancelError) {
                    console.error("Failed to cancel transaction:", cancelError);
                }
                navigate(-1);
                return;
            }

            setExecutionError(error?.shortMessage || error?.message || "Deposit transfer failed");
            // Don't reset hasExecutedRef here - user must click Retry button manually
        } finally {
            setIsExecuting(false);
        }
    }, [wallet, txNo, transactionData, refetchTransaction, navigate]);

    // Auto-execute for Metamask users when transaction is ready
    useEffect(() => {
        const transactionStatus = transactionData?.status;
        if (!txNo || !transactionData) return;
        if (hasExecutedRef.current) return;
        if (executionError) return; // Don't auto-retry on error

        if (transactionStatus === "completed") {
            onOpenModalSuccess();
        }

        // Only auto-execute for Metamask users
        if (loginProvider !== "metamask") return;

        // Execute when status is pending/awaiting_deposit/inprogress and no tx_hash yet
        const shouldExecute = (transactionStatus === "pending") && !transactionData.tx_hash;

        if (shouldExecute) {
            executeOfframpTransaction();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txNo, transactionData, loginProvider]);

    // Check if deposit has been detected (for Google flow)
    useEffect(() => {
        if (loginProvider !== "google") return;
        if (depositConfirmed) return;

        // Check if transaction status indicates deposit was detected,
        // OR deposit_address.status confirms deposit was received on-chain.
        // The deposit_address check ensures we show the progress widget even
        // when the order later goes to "failed" — the user needs to see what
        // happened after their deposit, not the deposit instruction again.
        const status = transactionData?.status;
        const depositStatus = transactionData?.deposit_address?.status;
        if (
            status === "deposit_detected" ||
            status === "inprogress" ||
            status === "settlement" ||
            status === "completed" ||
            depositStatus === "DETECTED" ||
            depositStatus === "CONFIRMED"
        ) {
            setDepositConfirmed(true);
            close();
        }
    }, [
        transactionData?.status,
        transactionData?.deposit_address?.status,
        loginProvider,
        depositConfirmed,
        close,
    ]);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!txNo) return;
        const unsubscribe = subscribe(txNo, (tx) => {
            if (tx.status === "completed" && !transactionData?.show_completed) {
                onOpenModalSuccess();
            }
            refetchTransaction();
        });

        return () => {
            unsubscribe();
            hasExecutedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txNo]);

    const handleRetry = () => {
        hasExecutedRef.current = false;
        setExecutionError(null);
        executeOfframpTransaction();
    };

    // Handle retry deposit for expired/failed orders
    // Called from OfframpButton which already shows confirmation modal
    const handleRetryDeposit = useCallback(async () => {
        try {
            await retryOfframpDeposit(txNo);
            setDepositConfirmed(false); // Reset to show deposit instruction again
            hasExecutedRef.current = false; // Reset execution flag for MetaMask flow
            setExecutionError(null); // Clear any previous errors
            await refetchTransaction();
        } catch (error) {
            console.error("Failed to retry deposit:", error);
            information({
                title: "Error",
                description: (
                    <p className="text-[#003E2C] text-center">
                        Failed to retry transaction. Please try again.
                    </p>
                ),
            });
        }
    }, [txNo, refetchTransaction, information]);

    return {
        transactionData,
        isLoadingTransaction,
        errorTransaction,
        uiMode,
        loginProvider,
        isConfirmingDeposit,
        isExecuting,
        executionError,
        handleDepositConfirmed,
        handleRetry,
        handleRetryDeposit,
    };
};

export default useWidgetOfframpAction;
