"use client";

import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useTradingFormStore } from "@/store/tradingFormStore";
import clsx from "clsx";
import { LockIcon } from "lucide-react";
import type { FC } from "react";

interface TradingActionProps {
    form: any;
    isSubmitting: boolean;
    isLoadingQuote?: boolean;
    offrampBelowMinimum?: boolean;
    onrampBelowMinimum?: boolean;
    insufficientBalance?: boolean;
    onOpenConnect: () => void;
    onSubmitTransaction: () => void;
}
const TradingAction: FC<TradingActionProps> = ({
    form,
    isSubmitting,
    isLoadingQuote,
    offrampBelowMinimum,
    onrampBelowMinimum,
    insufficientBalance,
    onOpenConnect,
    onSubmitTransaction,
}) => {
    const { loginSession } = useTradingAuthStore();
    const { getSelectedToken, toToken } = useTradingFormStore();
    const selectedToken = getSelectedToken();

    const buttonDisabled =
        isSubmitting ||
        !form.formState.isValid ||
        isLoadingQuote ||
        offrampBelowMinimum ||
        onrampBelowMinimum ||
        insufficientBalance ||
        (selectedToken?.chainId === 1151111081099710 &&
            loginSession?.provider === "metamask");

    if (!loginSession) {
        return (
            <button
                type="button"
                className={clsx(
                    "w-full h-[54px] flex items-center justify-center gap-2.5 p-2.5",
                    "bg-[#CBF23D] rounded-full hover:bg-[#b8d934] transition-colors cursor-pointer",
                    "font-semibold text-[#003E2C] text-lg"
                )}
                onClick={onOpenConnect}
            >
                <LockIcon className="w-4.5 h-4.5 text-[#003E2C]" />
                Connect Account
            </button>
        );
    }
    return (
        <button
            onClick={onSubmitTransaction}
            form="trading-form"
            className={clsx(
                "w-full h-[54px] flex items-center justify-center gap-2.5 p-2.5",
                "bg-[#CBF23D] rounded-full hover:bg-[#b8d934] transition-colors cursor-pointer",
                "font-semibold text-[#003E2C] text-lg",
                (buttonDisabled) && "opacity-50 cursor-not-allowed"
            )}
            disabled={buttonDisabled}
        >
            {isSubmitting
                ? "Processing..."
                : "Swap to " + (toToken?.symbol || "")}
        </button>
    );
};

export default TradingAction;
