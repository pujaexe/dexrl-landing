"use client";

import { Iconify } from "@/components/icon/Iconify";
import { formatElapsedTime } from "@/helper/date";
import { textWithCenterEllipsis } from "@/helper/string";
import clsx from "clsx";
import type { FC } from "react";
import type { TransactionData } from "../WidgetPayment.types";

interface IPaymentStepProps {
  transactionData?: TransactionData;
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

const PaymentStep: FC<IPaymentStepProps> = ({ transactionData }) => {

  const handleAddressTo = (address: string) => {
    const evmChains = [
      {
        chainId: 1,
        name: "ETH",
        url: "https://etherscan.io/address/",
      },
      {
        chainId: 56,
        name: "BSC",
        url: "https://bscscan.com/address/",
      },
      {
        chainId: 137,
        name: "POL",
        url: "https://polygonscan.com/address/",
      },
      {
        chainId: 8453,
        name: "BASE",
        url: "https://basescan.org/address/",
      },
    ];

    const nonEvmChains = [
      {
        chainId: 1151111081099710,
        name: "SOL",
        url: "https://solscan.io/account/",
      },
      {
        chainId: 20000000000001,
        name: "BTC",
        url: "https://mempool.space/address/",
      },
    ];

    const chainId = transactionData?.to_chain?.chain_id;
    const evmChain = evmChains.find((c) => c.chainId === chainId);
    const nonEvmChain = nonEvmChains.find((c) => c.chainId === chainId);

    if (evmChain) {
      const tokenAddress = transactionData?.to_token?.token_address?.toLowerCase();
      const nativeTokenAddress = transactionData?.to_chain?.native_token_address?.toLowerCase();
      const zeroAddress = "0x0000000000000000000000000000000000000000";

      const isNativeToken =
        tokenAddress === nativeTokenAddress ||
        tokenAddress === zeroAddress ||
        !tokenAddress;

      const suffix = isNativeToken ? "#internaltx" : "#tokentxns";
      return `${evmChain.url}${address}${suffix}`;
    }

    if (nonEvmChain) {
      return `${nonEvmChain.url}${address}`;
    }

    return address;
  };

  return (
    <div className={clsx("rounded-3xl py-3 px-4 w-full", "bg-[#ECF0EF]/60")}>
      <div className="font-semibold mb-4 text-[#003E2C]">Transaction Progress</div>
      <div className="space-y-3">
        {transactionData?.progress?.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between gap-3 items-start pb-1">
              {/* Icon Container */}
              <div className="relative flex flex-col items-center">
                <div
                  className={clsx(
                    "w-[40px] h-[40px] rounded-full flex items-center justify-center p-1.5 relative z-10 transition-colors",
                    step.status === "pending" && "bg-transparent",
                    step.status === "inprogress" && "bg-[#CBF23D]/70",
                    step.status === "completed" && "bg-[#CBF23D]/35",
                    step.status === "success" && "bg-green-500/15",
                    (step.status === "failed" || step.status === "cancelled") && "bg-red-500/15",
                  )}
                >
                  <Iconify
                    name={step.icon}
                    className={clsx(
                      "text-lg",
                      step.status === "pending" && "text-[#6A9080]",
                      step.status === "inprogress" &&
                      "text-[#003E2C] animate-spin",
                      step.status === "completed" && "text-[#003E2C]",
                      step.status === "success" && "text-green-600",
                      (step.status === "failed" ||
                        step.status === "cancelled") &&
                      "text-red-600",
                    )}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="w-full">
                <div className="flex gap-1">
                  <div
                    className={clsx(
                      "text-md font-normal text-[#003E2C]",
                      step.status === "pending" && "text-[#6A9080]!",
                    )}
                  >
                    {step.title}
                  </div>
                  {["completed", "success"].includes(step.status) && (
                    <div className="pt-1.5 text-xs font-light text-[#6A9080]">
                      ({formatElapsedTime(step.time * 1000)})
                    </div>
                  )}
                </div>
                <div
                  className={clsx("text-xs mt-1 font-light", "text-[#6A9080]")}
                >
                  {step.type === "link" ? (
                    <a
                      href={handleAddressTo(step.description)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline text-[#6A9080] hover:text-[#2D5C47]"
                    >
                      {textWithCenterEllipsis(step.description, 15, 5)}
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
                  step.status === "pending" && "bg-transparent text-[#6A9080]",
                  step.status === "inprogress" && "bg-[#CBF23D]/60 text-[#003E2C]",
                  step.status === "completed" && "bg-[#CBF23D] text-[#003E2C]",
                  step.status === "success" && "text-white bg-green-600",
                  (step.status === "failed" || step.status === "cancelled") &&
                  "bg-red-600 text-white",
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

export default PaymentStep;
