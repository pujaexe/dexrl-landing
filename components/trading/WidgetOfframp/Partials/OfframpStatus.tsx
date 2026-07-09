"use client";

import { Iconify } from "@/components/icon/Iconify";
import { textWithCenterEllipsis } from "@/helper/string";
import { date, formatDuration, normalizeTxDate } from "@/helper/date";
import clsx from "clsx";
import { useEffect, useState, type FC } from "react";
import type { OfframpTransactionData } from "../WidgetOfframp.types";
import { getExplorerTxUrl } from "../WidgetOfframp.data";
import { Tooltip } from "@/components/ui/Tooltip";
import RenderIf from "@/components/Renderif";
import { Loader2 } from "lucide-react";

interface IOfframpStatusProps {
    transactionData?: OfframpTransactionData;
    executionError?: string | null;
}

const OfframpStatus: FC<IOfframpStatusProps> = ({ transactionData, executionError }) => {
    const isPendingPayment =
        transactionData?.status === "pending" ||
        transactionData?.status === "awaiting_deposit";
    const isProcessing = [
        "deposit_detected",
        "inprogress",
        "settlement",
    ].includes(transactionData?.status || "");
    const isFailed = transactionData?.status === "failed";
    const isCancel = transactionData?.status === "cancelled";
    const isCompleted = transactionData?.status === "completed";
    const isExpired = transactionData?.status === "expired";

    const chainId = transactionData?.from_chain?.chain_id || 137;
    const txHash = transactionData?.burn_tx_hash || transactionData?.tx_hash;

    const scanLink = txHash ? getExplorerTxUrl(chainId, txHash) : "";

    const [timeElapsed, setTimeElapsed] = useState<string>("00:00");

    useEffect(() => {
        if (isCompleted) return;

        const interval = setInterval(() => {
            const now = date();

            const lastInprogressProgress = transactionData?.progress
                ?.filter((progress) => progress !== null && progress !== undefined && progress.status === "completed")
                ?.sort((a, b) => b.index - a.index)?.[0];
            const created = date(lastInprogressProgress?.date || normalizeTxDate(transactionData?.trx_date));
            const diffMs = now.diff(created, "millisecond");
            setTimeElapsed(formatDuration(diffMs));
        }, 1000);
        return () => clearInterval(interval);
    }, [transactionData?.progress, transactionData?.status, transactionData?.trx_date, isCompleted]);

    if (executionError) {
        return (
            <Container>
                <div className="flex items-center">
                    <div
                        className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center p-1.5 relative mr-3",
                            "bg-white"
                        )}
                    >
                        <Iconify
                            name="lucide:alert-circle"
                            className="text-xl text-red-500"
                        />
                    </div>
                    <div className="text-[#003E2C] text-sm flex-1">
                        <div className="font-medium text-red-500">
                            Swap Execution Failed
                        </div>
                        <div className="text-xs text-[#6A9080] font-light truncate">
                            {executionError}
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    if (isPendingPayment || isProcessing) {
        return (
            <Container>
                <div className="flex items-center">
                    <div
                        className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center timer-animation p-1.5 relative mr-3",
                            "bg-white"
                        )}
                    >
                        <Iconify
                            name="icon-park-outline:time"
                            className="text-xl text-[#003E2C]"
                        />
                    </div>
                    <div className="text-[#003E2C] text-sm">
                        <div>
                            Current Step Duration{" "}
                            <span
                                id="timer"
                                className="font-medium text-[#003E2C]"
                            >
                                {timeElapsed}
                            </span>
                        </div>
                        <div className="text-xs text-[#6A9080] font-light">
                            Time elapsed for the active process.
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    if (isFailed || isCancel || isExpired) {
        return (
            <Container>
                <div className="flex items-center">
                    <div
                        className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center timer-animation p-1.5 relative mr-3",
                            "bg-white"
                        )}
                    >
                        <Iconify
                            name="icon-park-outline:time"
                            className="text-xl text-red-600"
                        />
                    </div>
                    <div className="text-[#003E2C] text-sm">
                        <div>
                            Transaction{" "}
                            {isFailed
                                ? "Reverted"
                                : isExpired
                                ? "Expired"
                                : "Cancelled"}{" "}
                            <span className="font-medium text-red-600">
                                {isFailed
                                    ? "REVERTED"
                                    : isExpired
                                    ? "EXPIRED"
                                    : "CANCELLED"}
                            </span>
                        </div>
                        <div className="text-xs">
                            {isFailed
                                ? "Please contact our Customer Support"
                                : isExpired
                                ? "The deposit window has expired. Please create a new order."
                                : "Transaction cancelled by user"}
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="flex items-center">
                <div
                    className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center timer-animation p-1.5 relative mr-3",
                        "bg-white"
                    )}
                >
                    <Iconify
                        name="lucide:check-circle"
                        className="text-2xl text-green-600"
                    />
                </div>
                <div className="w-full">
                    <div className="text-sm text-[#003E2C]">Transaction Hash</div>
                    <RenderIf isTrue={!isCompleted && !!txHash}>
                        <Tooltip
                            title={
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Loader2 className="animate-spin w-4 h-4 text-[#003E2C]" />
                                    <p className="text-xs">
                                        Transaction is being processed
                                    </p>
                                </div>
                            }
                        >
                            <p className="cursor-pointer text-xs underline text-[#6A9080] hover:text-[#2D5C47]">
                                {textWithCenterEllipsis(txHash || "N/A", 15, 15)}
                            </p>
                        </Tooltip>
                    </RenderIf>

                    <RenderIf isTrue={isCompleted && !!txHash}>
                        <a
                            href={scanLink}
                            target="_blank"
                            className="text-xs underline text-[#6A9080] hover:text-[#2D5C47]"
                        >
                            {textWithCenterEllipsis(txHash || "N/A", 15, 15)}
                        </a>
                    </RenderIf>

                    <RenderIf isTrue={!txHash}>
                        <p className="text-xs text-[#6A9080]">N/A</p>
                    </RenderIf>
                </div>
            </div>
        </Container>
    );
};

const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={clsx("rounded-3xl py-3 px-4 w-full", "bg-[#ECF0EF]/60")}>
            {children}
        </div>
    );
};

export default OfframpStatus;
