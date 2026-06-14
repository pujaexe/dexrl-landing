"use client";

import { Iconify } from "@/components/icon/Iconify";
import { formatDate } from "@/helper/date";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";

interface TransactionItemProps {
    trx: any;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ trx }) => {
    const [copied, setCopied] = useState("");
    const navigate = useNavigate();
    const { username } = useParams();

    const handleRedirect = (trx: any) => {
        if (trx.trxType === 'buy') {
            navigate(`/${username}/${trx.transactionId}`);
        } else {
            navigate(`/${username}/redeem/${trx.transactionId}`);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(text);
            setTimeout(() => setCopied(""), 1500);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div
            className={clsx(
                "space-y-5 p-3 bg-[#ECF0EF]/70 cursor-pointer rounded-xl transition-colors duration-200",
                "hover:bg-[#ECF0EF]"
            )}
            onClick={() => handleRedirect(trx)}
        >
            {/* Transaction ID + Copy */}
            <div
                className={clsx(
                    "flex justify-between text-sm bg-[#F4F6F9]/10 rounded-lg p-2",
                    "text-[#6A9080]"
                )}
            >
                <span className="">
                    Transaction ID
                    <span
                        className={clsx(
                            "font-normal ml-2",
                            "text-[#003E2C]"
                        )}
                    >
                        {trx.transactionId}
                    </span>
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(trx.transactionId);
                    }}
                    className={clsx(
                        "flex items-center gap-1 transition-colors",
                        "hover:text-[#003E2C]"
                    )}
                >
                    <Iconify
                        name={
                            copied === trx.transactionId
                                ? "mdi:check-bold"
                                : "ic:baseline-content-copy"
                        }
                        className="text-sm"
                    />
                    {copied === trx.transactionId ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* Title + Status */}
            <div className="flex justify-between items-center">
                <span className="font-bold">
                    Swap to {trx.swapTo}
                </span>
                <div
                    className={clsx(
                        "flex gap-1 items-center text-sm p-1 px-3 capitalize rounded-full whitespace-nowrap",
                        trx.status === "completed" &&
                        "bg-[#CBF23D]/25 text-[#2F5D12]",
                        trx.status === "inprogress" &&
                        "bg-[#FEF3C7] text-[#92681A]",
                        trx.status === "pending" &&
                        "bg-[#FEF3C7] text-[#92681A]",
                        (trx.status === "failed" || trx.status === "cancelled") && "bg-[#FBE2E2] text-[#C0392B]"
                    )}
                >
                    <div>{trx.status}</div>
                    <Iconify
                        name="radix-icons:external-link"
                        className="text-xs"
                    />
                </div>
            </div>

            {/* Amount + Date */}
            <div
                className={clsx(
                    "flex justify-between text-sm",
                    "text-[#9CA3AF]"
                )}
            >
                <span>
                    {trx.amount} {trx.token} {trx?.trxType === 'buy' ? '' : `(${trx.chain})`}
                </span>
                <span>{formatDate(trx.orderDate)}</span>
            </div>
        </div>
    );
};

export default TransactionItem;