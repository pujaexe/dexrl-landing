"use client";

import type { QuoteData } from "@/api/onrampService";
import type { OfframpQuoteData } from "@/api/offrampService";
import RenderIf from "@/components/Renderif";
import { Skeleton } from "@/components/skeleton";
import { formatTokenAmountWithoutRounding } from "@/helper";
import { formatRp } from "@/helper/rupiah";
import { MIN_AMOUNT_BUY, MIN_AMOUNT_SELL } from "@/lib/constant";
import { useTradingFormStore } from "@/store/tradingFormStore";
import { useEffect, useState } from "react";
interface QuoteEstimationProps {
    quoteData?: QuoteData | OfframpQuoteData,
    isErrorQuote?: boolean,
    isLoadingQuote?: boolean,
    isEnabledQuote?: boolean,
    offrampBelowMinimum?: boolean,
    onrampBelowMinimum?: boolean,
}

const QuoteEstimation = ({
    quoteData,
    isErrorQuote,
    isLoadingQuote,
    isEnabledQuote,
    offrampBelowMinimum,
    onrampBelowMinimum,
}: QuoteEstimationProps) => {
    const [countdown, setCountdown] = useState(60);
    const { toToken, formActive } = useTradingFormStore();
    const tokenSymbol = toToken?.symbol;
    const isOfframp = formActive === "offramp";

    useEffect(() => {
        if (quoteData?.toAmountMin && !isErrorQuote) {
            setCountdown(60);
        }
    }, [quoteData, isErrorQuote]);

    useEffect(() => {
        if (!isEnabledQuote || isLoadingQuote || countdown <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setCountdown((prev) => {
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isEnabledQuote, isLoadingQuote, countdown]);

    // Reset countdown when quote data changes
    useEffect(() => {
        if (!quoteData) {
            setCountdown(0);
            return;
        }
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [quoteData]);

    // Get display value based on mode
    const getReceivedAmount = () => {
        if (isOfframp) {
            const offrampData = quoteData as OfframpQuoteData;
            return `IDRX ${formatRp(String(offrampData?.toAmountIdr || 0))}`;
        }
        return `${formatTokenAmountWithoutRounding(String(quoteData?.toAmountMin || 0), 6)} ${tokenSymbol || ""}`;
    };

    return (
        <div className="flex flex-col gap-[15px] pt-4 w-full border-t border-[#D8E3DF]">
            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="font-medium text-[#2D5C47] text-base">
                        {isOfframp ? "You Will Receive" : "Minimum Received"}
                    </div>

                    <RenderIf isTrue={!!isLoadingQuote}>
                        <Skeleton className="w-20 h-6" />
                    </RenderIf>

                    <RenderIf isTrue={!isLoadingQuote}>
                        <div className={`font-medium text-base ${(offrampBelowMinimum || onrampBelowMinimum) ? 'text-red-500' : 'text-[#003E2C]'}`}>
                            {getReceivedAmount()}
                        </div>
                    </RenderIf>
                </div>

                <RenderIf isTrue={!!offrampBelowMinimum && !isLoadingQuote}>
                    <p className="text-xs text-red-500">
                        Minimum sell amount is IDRX {formatRp(String((quoteData as OfframpQuoteData)?.minAmountIdr || MIN_AMOUNT_SELL))}
                    </p>
                </RenderIf>

                <RenderIf isTrue={!!onrampBelowMinimum && !isLoadingQuote}>
                    <p className="text-xs text-red-500">
                        Minimum buy amount is IDR {formatRp(String((quoteData as QuoteData)?.minAmountIdr || MIN_AMOUNT_BUY))}
                    </p>
                </RenderIf>
            </div>

            <div className="flex items-center justify-between w-full">
                <div className="font-medium text-[#2D5C47] text-base">
                    Quote valid for
                </div>

                <RenderIf isTrue={!!isLoadingQuote}>
                    <div className="flex w-[190px] items-center justify-end gap-2">
                        <Skeleton className="w-10 h-6" />
                        <div>|</div>
                        <Skeleton className="w-15 h-6" />
                    </div>
                </RenderIf>

                <RenderIf isTrue={!isLoadingQuote}>
                    <div className="flex w-[190px] items-center justify-end gap-2">
                        <div className="font-medium text-[#497bf8] text-base">
                            {countdown}s
                        </div>

                        {quoteData?.toolDetail && (
                            <div>|</div>
                        )}

                        {
                            quoteData?.toolDetail && (
                                <div className="inline-flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full overflow-hidden bg-white">
                                        <img
                                            className="w-full h-full object-contain"
                                            alt={quoteData?.toolDetail?.name}
                                            src={quoteData?.toolDetail?.logoURI}
                                        />
                                    </div>

                                    <div className="font-medium text-[#757e9d] text-xs line-clamp-1 max-w-[90px]">{quoteData?.toolDetail?.name}</div>
                                </div>
                            )
                        }
                    </div>
                </RenderIf>
            </div>
        </div>
    );
};

export default QuoteEstimation;
