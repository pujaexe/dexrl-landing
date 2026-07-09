"use client";

import { useModal } from "@/context/ModalContext";
import clsx from "clsx";
import { RefreshCcwIcon, XIcon } from "lucide-react";
import type { ButtonHTMLAttributes, FC } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";
import type { OfframpTransactionData } from "../WidgetOfframp.types";
import { cancelOfframpTransaction } from "@/api/offrampService";

interface IOfframpButtonProps {
    transactionData?: OfframpTransactionData;
    onRetry?: () => void;
    onRetryFailed?: () => void;
    isExecuting?: boolean;
    executionError?: string | null;
}

const OfframpButton: FC<IOfframpButtonProps> = ({
    transactionData,
    onRetry,
    onRetryFailed,
    isExecuting,
    executionError,
}) => {
    const navigate = useNavigate();
    const { username } = useParams();

    const isFailed = transactionData?.status === "failed";
    const isCompleted = transactionData?.status === "completed";
    const inProgress = [
        "inprogress",
        "settlement",
        "deposit_detected",
    ].includes(transactionData?.status || "");
    const isPending =
        transactionData?.status === "pending" ||
        transactionData?.status === "awaiting_deposit";
    const isCancelled = transactionData?.status === "cancelled";
    const isExpired = transactionData?.status === "expired";

    const { confirm, close } = useModal();

    const handleCancelOrder = async () => {
        if (!transactionData) return
        confirm({
            title: "Cancel transaction?",
            icon: <XIcon className="w-8 h-8 text-[#ECF0EF]" />,
            description:
                "Are you sure you want to cancel? Any progress will be lost and you will need to start over.",
            cancelText: "Go Back",
            confirmText: "Yes, Cancel",
            onConfirm: async () => {
                await cancelOfframpTransaction(transactionData?.trx_no);
                navigate(-1);
                close();
            },
        });
    };

    const handleRetryFailed = async () => {
        confirm({
            title: "Retry Transaction?",
            icon: <RefreshCcwIcon className="w-8 h-8 text-[#ECF0EF]" />,
            description:
                "This will reset the transaction and allow it to be processed again. Are you sure?",
            onConfirm: async () => {
                onRetryFailed?.();
                close();
            },
        });
    };

    const handleCustomerSupport = () => {
        const contactSupport = "https://wa.me/6281214690096";
        const anchor = document.createElement("a");
        Object.assign(anchor, {
            target: "_blank",
            rel: "noopener noreferrer",
            href: contactSupport,
        });
        anchor.click();
    };

    const handleViewHistory = () => {
        navigate(`/${username}/transaction-history`);
    };

    const handleNewTransaction = () => {
        navigate(`/${username}`);
    };

    return (
        <div className="flex justify-between gap-4 w-full">
            {/* LEFT */}
            {isPending && !executionError && (
                <ButtonComponent variant="outline" onClick={handleCancelOrder}>
                    Cancel Order
                </ButtonComponent>
            )}

            {executionError && (
                <ButtonComponent variant="outline" onClick={handleCancelOrder}>
                    Cancel Order
                </ButtonComponent>
            )}

            {isFailed && (
                <ButtonComponent variant="outline" onClick={handleRetryFailed}>
                    Retry
                </ButtonComponent>
            )}

            {(inProgress || isCompleted || isCancelled || isExpired) && !executionError && (
                <ButtonComponent variant="outline" onClick={handleViewHistory}>
                    View History
                </ButtonComponent>
            )}

            {/* RIGHT */}
            {isPending && !isExecuting && (
                <ButtonComponent variant="solid" disabled>
                    Awaiting Deposit
                </ButtonComponent>
            )}

            {isExecuting && (
                <ButtonComponent variant="solid" disabled>
                    Executing Swap...
                </ButtonComponent>
            )}

            {executionError && !isExecuting && (
                <ButtonComponent variant="solid" onClick={() => onRetry?.()}>
                    Retry Swap
                </ButtonComponent>
            )}

            {isFailed && (
                <ButtonComponent variant="solid" onClick={handleCustomerSupport}>
                    Customer Support
                </ButtonComponent>
            )}

            {inProgress && !executionError && !isExecuting && (
                <ButtonComponent variant="solid" disabled>
                    Processing
                </ButtonComponent>
            )}

            {(isCompleted || isCancelled || isExpired) && (
                <ButtonComponent variant="solid" onClick={handleNewTransaction}>
                    New Transaction
                </ButtonComponent>
            )}
        </div>
    );
};

interface IButtonComponentProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "solid" | "outline";
}

const ButtonComponent: FC<IButtonComponentProps> = ({
    variant = "solid",
    ...props
}) => {
    return (
        <button
            {...props}
            className={clsx(
                variant === "solid" &&
                "w-full font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors bg-[#CBF23D] hover:bg-[#CBF23D] text-[#003E2C] cursor-pointer disabled:bg-[#ECF0EF] disabled:text-[#6A9080] disabled:cursor-not-allowed",
                variant === "outline" &&
                "w-full border border-solid border-[#CBF23D] text-[#003E2C] hover:bg-[#CBF23D]/10 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:border-[#C2CFCB] disabled:text-[#6A9080] disabled:bg-transparent disabled:cursor-not-allowed",
                props.className
            )}
        >
            {props.children}
        </button>
    );
};

export default OfframpButton;
