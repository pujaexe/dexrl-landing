"use client";

import { useTradingFormStore } from "@/store/tradingFormStore";
import clsx from "clsx";
import ModalOfframpSuccess from "./Partials/ModalOfframpSuccess";
import OfframpButton from "./Partials/OfframpButton";
import OfframpHeader from "./Partials/OfframpHeader";
import {
    OfframpSkeleton,
    DepositInstructionSkeleton,
} from "./Partials/OfframpSkeleton";
import OfframpStatus from "./Partials/OfframpStatus";
import OfframpStep from "./Partials/OfframpStep";
import DepositInstruction from "./Partials/DepositInstruction";
import useWidgetOfframpAction from "./WidgetOfframp.action";
import type { IOfframpStep } from "./WidgetOfframp.data";
import { AdminActionsPanelGate } from "../AdminActionsPanel";

const WidgetOfframp = () => {
    const {
        transactionData,
        isLoadingTransaction,
        errorTransaction,
        uiMode,
        isConfirmingDeposit,
        isExecuting,
        executionError,
        handleDepositConfirmed,
        handleRetry,
        handleRetryDeposit,
    } = useWidgetOfframpAction();

    const { isOpenModalSuccess, onCloseModalSuccess } = useTradingFormStore();

    // Loading state
    if (isLoadingTransaction) {
        return (
            <div className="flex flex-col w-full gap-4 p-4">
                {uiMode === "deposit_instruction" ? (
                    <DepositInstructionSkeleton />
                ) : (
                    <OfframpSkeleton />
                )}
            </div>
        );
    }

    // Error state
    if (errorTransaction) {
        return (
            <div className="flex flex-col w-full gap-4 p-4">
                <div className="text-[#003E2C] text-center">
                    Transaction not found.
                </div>
            </div>
        );
    }

    // Mode A: Google Login - Show Deposit Instruction first
    if (uiMode === "deposit_instruction") {
        return (
            <div
                id="offramp-widget"
                className={clsx(
                    "relative flex flex-col w-full gap-4 p-4 overflow-hidden",
                )}
            >
                <DepositInstruction
                    transactionData={transactionData}
                    onDepositConfirmed={handleDepositConfirmed}
                    onRetry={handleRetryDeposit}
                    isConfirming={isConfirmingDeposit}
                />

                {transactionData?.trx_no && (
                    <AdminActionsPanelGate
                        trxNo={transactionData.trx_no}
                        trxType="sell"
                        status={transactionData?.status}
                    />
                )}

                <ModalOfframpSuccess
                    open={isOpenModalSuccess}
                    onClose={onCloseModalSuccess}
                    transactionData={transactionData}
                />
            </div>
        );
    }

    // Mode B: Metamask Login OR after deposit confirmed - Show Redemption Process
    // Convert progress to IOfframpStep format for header
    const steps: IOfframpStep[] =
        transactionData?.progress
            ?.filter((p): p is NonNullable<typeof p> => p !== null && p !== undefined)
            .map((p) => ({
                icon: p.icon,
                title: p.title,
                description: p.description,
                status: p.status,
                type: p.type,
                time: p.time,
                code: p.code,
                index: p.index,
            })) || [];

    return (
        <div className={clsx("flex flex-col w-full gap-4 p-4")}>
            <div className="flex flex-col items-start gap-3 w-full">
                <OfframpHeader steps={steps} mode={uiMode} />

                <OfframpStep transactionData={transactionData} />

                <OfframpStatus transactionData={transactionData} executionError={executionError} />
            </div>

            <OfframpButton
                transactionData={transactionData}
                onRetry={handleRetry}
                onRetryFailed={handleRetryDeposit}
                isExecuting={isExecuting}
                executionError={executionError}
            />

            {transactionData?.trx_no && (
                <AdminActionsPanelGate
                    trxNo={transactionData.trx_no}
                    trxType="sell"
                    status={transactionData?.status}
                />
            )}

            <ModalOfframpSuccess
                open={isOpenModalSuccess}
                onClose={onCloseModalSuccess}
                transactionData={transactionData}
            />
        </div>
    );
};

export default WidgetOfframp;
