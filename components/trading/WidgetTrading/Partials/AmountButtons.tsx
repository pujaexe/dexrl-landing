"use client";

import { getMetamaskBalance, isSupportedChain, isNativeTokenAddress } from "@/helper/metamaskBalanceHelper";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useTradingFormStore } from "@/store/tradingFormStore";
import { useQuery } from "@tanstack/react-query";
import { useSmartMax } from "@/hooks/useSmartMax";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import MaintenanceMessage from "@/components/MaintenanceMessage";
import { Iconify } from "@/components/icon/Iconify";

interface AmountButtonsProps {
    onSetAmount: (amount: string) => void;
}

const AmountButtons = ({ onSetAmount }: AmountButtonsProps) => {
    const { wallet, loginSession } = useTradingAuthStore();
    const { getSelectedToken } = useTradingFormStore();
    const selectedToken = getSelectedToken();

    const isMetamask = loginSession?.provider === "metamask";
    const walletAddress = wallet?.eoaAddress;
    const chainId = selectedToken?.chainId;
    const tokenAddress = selectedToken?.address;
    const decimals = selectedToken?.decimals || 18;
    const tokenSymbol = selectedToken?.symbol || "";

    const isNativeToken = isNativeTokenAddress(tokenAddress);
    const isChainSupported = chainId ? isSupportedChain(chainId) : false;

    // State for UI feedback
    const [showHelperText, setShowHelperText] = useState(false);

    const { data: balance, isLoading } = useQuery({
        queryKey: ["token-balance", walletAddress, chainId, tokenAddress],
        queryFn: async () => {
            if (!walletAddress || !chainId) return "0";

            const result = await getMetamaskBalance(
                walletAddress,
                chainId,
                tokenAddress,
                decimals
            );
            return result.formatted;
        },
        enabled: !!walletAddress && !!chainId && isMetamask && isChainSupported,
        staleTime: 30000,
        refetchInterval: 60000,
        retry: false,
    });

    // Smart Max hook for dynamic gas estimation
    const {
        reservedGas,
        error,
        isCalculating,
        calculateSmartMax,
    } = useSmartMax({
        chainId: chainId || 0,
        tokenAddress,
        tokenDecimals: decimals,
        balance: balance || "0",
        isNativeToken,
    });

    if (!isMetamask || !walletAddress) return null;

    const balanceNum = parseFloat(balance || "0");

    const handleHalf = () => {
        const half = balanceNum / 2;
        if (half > 0) {
            onSetAmount(half.toString());
            setShowHelperText(false);
        }
    };

    const handleMax = async () => {
        if (balanceNum > 0) {
            setShowHelperText(false);

            // Calculate smart max - returns result directly
            const result = await calculateSmartMax();

            if (result.maxAmount) {
                onSetAmount(result.maxAmount);
                setShowHelperText(true);
            }
        }
    };

    // Determine if button should be disabled
    const isMaxDisabled = balanceNum <= 0 || isLoading || isCalculating;

    return (
        <div className="w-full flex justify-between gap-2 items-center ml-1">
            <div>
                {showHelperText && reservedGas && !error && (
                    <MaintenanceMessage
                        isMaintenance
                        content={`~ ${reservedGas} ${tokenSymbol} dicadangkan secara otomatis untuk biaya gas.`}
                        title="Information"
                    >
                        <p className="cursor-pointer">
                            <Iconify name="material-symbols:info-outline-rounded" className="text-[#003E2C] text-md" />
                        </p>
                    </MaintenanceMessage>
                )}

                {error && (
                    <MaintenanceMessage
                        isMaintenance
                        content={error}
                        title="Error!"
                    >
                        <p className="cursor-pointer">
                            <Iconify name="material-symbols:info-outline-rounded" className="text-red-500 text-md" />
                        </p>
                    </MaintenanceMessage>
                )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleHalf}
                    disabled={balanceNum <= 0 || isLoading}
                    className="cursor-pointer px-0 py-0.5 text-xs font-medium text-[#003E2C] hover:text-[#003E2C]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    HALF
                </button>
                <button
                    type="button"
                    onClick={handleMax}
                    disabled={isMaxDisabled}
                    className="cursor-pointer px-0 py-0.5 text-xs font-medium text-[#003E2C] hover:text-[#003E2C]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                >
                    {isCalculating ? (
                        <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Calculating...</span>
                        </>
                    ) : (
                        "MAX"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AmountButtons;
