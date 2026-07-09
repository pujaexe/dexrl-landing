"use client";

import { Iconify } from "@/components/icon/Iconify";
import { formatElapsedTime } from "@/helper/date";
import { textWithCenterEllipsis } from "@/helper/string";
import clsx from "clsx";
import type { FC } from "react";
import type { OfframpTransactionData } from "../WidgetOfframp.types";
import { getExplorerAddressUrl } from "../WidgetOfframp.data";
import { Tooltip } from "@/components/ui/Tooltip";

interface IOfframpStepProps {
    transactionData?: OfframpTransactionData;
}

const statusLabel = (status: string) => {
    switch (status) {
        case "pending":
            return "Pending";
        case "inprogress":
            return "Active";
        case "completed":
            return "Completed";
        case "success":
            return "Success";
        case "failed":
            return "Reverted";
        case "cancelled":
            return "Cancelled";
    }
    return status;
};

const OfframpStep: FC<IOfframpStepProps> = ({ transactionData }) => {
    const handleAddressTo = (address: string) => {
        const chainId = transactionData?.to_chain?.chain_id || 137;
        return getExplorerAddressUrl(chainId, address);
    };

    return (
        <div className={clsx("rounded-3xl py-3 px-4 w-full", "bg-[#ECF0EF]/60")}>
            <div className="font-semibold mb-4 text-[#003E2C]">
                Transaction Progress
            </div>
            <div className="space-y-3">
                {transactionData?.progress
                    ?.filter((step): step is NonNullable<typeof step> => step !== null && step !== undefined)
                    .map((step, index) => (
                    <div key={index} className="relative">
                        <div className="flex justify-between gap-3 items-start pb-1">
                            {/* Icon Container */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center p-1.5 relative z-10 transition-colors",
                                        step.status === "pending" &&
                                            "bg-transparent",
                                        step.status === "inprogress" &&
                                            "bg-[#CBF23D]/70",
                                        step.status === "completed" &&
                                            "bg-[#CBF23D]/35",
                                        step.status === "success" &&
                                            "bg-green-500/15",
                                        (step.status === "failed" ||
                                            step.status === "cancelled") &&
                                            "bg-red-500/15"
                                    )}
                                >
                                    <Iconify
                                        name={step.icon}
                                        className={clsx(
                                            "text-lg",
                                            step.status === "pending" &&
                                                "text-[#6A9080]",
                                            step.status === "inprogress" &&
                                                "text-[#003E2C] animate-spin",
                                            step.status === "completed" &&
                                                "text-[#003E2C]",
                                            step.status === "success" &&
                                                "text-green-600",
                                            (step.status === "failed" ||
                                                step.status === "cancelled") &&
                                                "text-red-600"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Step Content */}
                            <div className="w-full">
                                <div className="flex gap-1">
                                    <Tooltip title={step.title}>
                                        <div
                                            className={clsx(
                                                "text-md font-normal text-[#003E2C]",
                                                step.status === "pending" &&
                                                    "text-[#6A9080]!",
                                                    "line-clamp-1"
                                            )}
                                        >
                                            {step.title}
                                        </div>
                                    </Tooltip>
                                    {["completed", "success"].includes(
                                        step.status
                                    ) && (
                                        <div className="pt-1.5 text-xs font-light text-[#6A9080] whitespace-nowrap">
                                            ({formatElapsedTime(step.time * 1000)})
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={clsx(
                                        "text-xs mt-1",
                                        "text-[#6A9080]"
                                    )}
                                >
                                    {step.type === "link" ? (
                                        <a
                                            href={handleAddressTo(
                                                step.description
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs underline text-[#6A9080] hover:text-[#2D5C47]"
                                        >
                                            {textWithCenterEllipsis(
                                                step.description,
                                                15,
                                                5
                                            )}
                                        </a>
                                    ) : (
                                        step.description
                                    )}
                                </div>
                            </div>

                            {/* Badge */}
                            <div
                                className={clsx(
                                    "text-xs font-normal p-1 px-3 capitalize whitespace-nowrap rounded-full",
                                    step.status === "pending" &&
                                        "bg-transparent text-[#6A9080]",
                                    step.status === "inprogress" &&
                                        "bg-[#CBF23D]/60 text-[#003E2C]",
                                    step.status === "completed" &&
                                        "bg-[#CBF23D] text-[#003E2C]",
                                    step.status === "success" &&
                                        "text-white bg-green-600",
                                    (step.status === "failed" ||
                                        step.status === "cancelled") &&
                                        "bg-red-600 text-white"
                                )}
                            >
                                {statusLabel(step.status)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfframpStep;
