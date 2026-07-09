"use client";

import { useMemo, type FC } from "react";
import type { IOfframpStep } from "../WidgetOfframp.data";
import type { OfframpMode } from "../WidgetOfframp.types";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";

interface IOfframpHeaderProps {
    steps: IOfframpStep[];
    mode: OfframpMode;
}

const OfframpHeader: FC<IOfframpHeaderProps> = ({ steps, mode }) => {
    const navigate = useNavigate();

    const step = useMemo(() => {
        // For deposit instruction mode
        if (mode === "deposit_instruction") {
            return {
                title: "Deposit Instruction",
                description:
                    "Send the exact amount to the address below to proceed with your sale.",
            };
        }

        // For redemption process mode - dynamic based on current step
        const statuses = [
            "inprogress",
            "completed",
            "failed",
            "success",
            "cancelled",
        ];
        const lastInProgress = [...steps]
            .reverse()
            .find((step) => statuses.includes(step.status));

        switch (lastInProgress?.code) {
            case "ORDER_INITIATED":
                return {
                    title: "Redemption Process",
                    description:
                        "Converting crypto to fiat via IDRX protocol.",
                };
            case "ROUTING_BEST_PRICE":
                return {
                    title: "Routing Best Price",
                    description:
                        "Scanning liquidity pools across DEXs for the most efficient swap.",
                };
            case "EXECUTING_SWAP":
                return {
                    title:
                        ["failed", "cancelled"].includes(
                            lastInProgress?.status
                        )
                            ? "Swap Execution Reverted"
                            : "Executing Swap",
                    description:
                        ["failed", "cancelled"].includes(
                            lastInProgress?.status
                        )
                            ? "Network conditions caused the swap to revert. Please retry or contact support."
                            : "Awaiting block confirmation on the network.",
                };
            case "INITIATING_REDEMPTION":
                return {
                    title:
                        ["failed", "cancelled"].includes(
                            lastInProgress?.status
                        )
                            ? "Redemption Failed"
                            : "Processing Redemption",
                    description:
                        ["failed", "cancelled"].includes(
                            lastInProgress?.status
                        )
                            ? "The redemption process failed. Please retry or contact support."
                            : "Burning IDRX to initiate redemption. \nSettlement will be handled by the IDRX protocol.",
                };
            case "TRANSFER_TO_BANK":
                return {
                    title:
                        lastInProgress?.status === "completed" ||
                            lastInProgress?.status === "success"
                            ? "Redemption Completed"
                            : "Redemption in Progress",
                    description:
                        lastInProgress?.status === "completed" ||
                            lastInProgress?.status === "success"
                            ? "Your IDRX redemption has been successfully completed"
                            : "Your IDRX redemption request is being processed.",
                };
            default:
                return {
                    title: "Redemption Process",
                    description:
                        "Converting crypto to fiat via IDRX protocol.",
                };
        }
    }, [steps, mode]);

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

                <p className="w-full font-normal text-[#6A9080] text-[16px] mt-1 whitespace-pre-line font-manrope">
                    {step.description}
                </p>
            </div>
        </div>
    );
};

export default OfframpHeader;
