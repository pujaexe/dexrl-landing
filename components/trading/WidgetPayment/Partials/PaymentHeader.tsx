"use client";

import { useMemo, type FC } from "react";
import type { IStep } from "../WidgetPayment.data";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";

interface IPaymentHeaderProps {
    steps: IStep[];
}

const PaymentHeader: FC<IPaymentHeaderProps> = ({
    steps,
}) => {
    const navigate = useNavigate();

    const step = useMemo(() => {
        const statuses = ["inprogress", "completed", "failed", "success", "cancelled"];
        const lastInProgress = [...steps].reverse().find(step => statuses.includes(step.status));
        switch (lastInProgress?.code) {
            case "ORDER_INITIATED":
                return {
                    title: "Awaiting IDRX Transaction",
                    description: "Once the transfer is verified, your IDRX will be minted automatically in a few moments...",
                };
            case "MINTING_STABLECOIN":
                return {
                    title: ['failed', 'cancelled'].includes(lastInProgress?.status) ? "Transaction Reverted" : "Awaiting IDRX Transaction",
                    description: ['failed', 'cancelled'].includes(lastInProgress?.status) ? "The minting request could not be finalized on-chain. No assets were transferred" : "Once the transfer is verified, your IDRX will be minted automatically in a few moments..",
                };
            case "ROUTING_BEST_PRICE":
                return {
                    title: "Routing Best Price",
                    description: "Scanning liquidity pools across DEXs for the most efficient swap.",
                };
            case "EXECUTING_SWAP":
                return {
                    title: ['failed', 'cancelled'].includes(lastInProgress?.status) ? "Swap Execution Reverted" : "Executing Swap",
                    description: ['failed', 'cancelled'].includes(lastInProgress?.status) ? "Network conditions caused the swap to revert. Please retry or contact support." : "Scanning liquidity pools across DEXs for the most efficient swap.",
                };
            case "SETTLEMENT":
                return {
                    title: "Transaction Submitted",
                    description: "Assets are settling in your wallet.",
                };
            default:
                return {
                    title: "Awaiting IDRX Transaction",
                    description: "Once the transfer is verified, your IDRX will be minted automatically in a few moments..",
                };
        }
    }, [steps]);

    return (
        <div className="flex flex-col items-start gap-5 w-full">
            <div className="flex flex-col items-start gap-1 w-full">
                <div className="flex items-center justify-center w-full gap-4">
                    <button
                        type="button"
                        aria-label="Back"
                        className="flex items-center justify-center min-w-[36px] w-[36px] h-[36px] rounded-xl bg-[#ECF0EF] hover:bg-[#D8E3DF] transition-colors cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-[#003E2C]" />
                    </button>
                    <h2 className="w-full font-normal text-[#003E2C] text-xl whitespace-nowrap">
                        {step.title}
                    </h2>
                </div>

                <p className="w-full font-normal text-[#6A9080] text-base mt-1">
                    {step.description}
                </p>
            </div>
        </div>
    )
}

export default PaymentHeader;