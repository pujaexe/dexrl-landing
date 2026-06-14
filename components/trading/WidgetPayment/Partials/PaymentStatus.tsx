"use client";

import { Iconify } from "@/components/icon/Iconify";
import { textWithCenterEllipsis } from "@/helper/string";
import { formatDuration } from "@/helper/date";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState, type FC } from "react";
import type { TransactionData } from "../WidgetPayment.types";
import { generateTxHashLink } from "@/helper/bridge";
import { USDT_POL_ADDRESS } from "../WidgetPayment.data";
import { Tooltip } from "@/components/ui/Tooltip";
import RenderIf from "@/components/Renderif";
import { Loader2 } from "lucide-react";

interface IPaymentStatusProps {
  transactionData?: TransactionData;
}

const PaymentStatus: FC<IPaymentStatusProps> = ({
  transactionData,
}) => {
  const isPendingPayment = transactionData?.status === "pending";
  const isProcessing = ["executing", 'inprogress', 'routing', 'settlement'].includes(transactionData?.status || '');
  const isFailed = transactionData?.status === "failed";
  const isCancel = transactionData?.status === "cancelled";
  const isCompleted = transactionData?.status === "completed";

  const fromChainId = transactionData?.from_chain?.chain_id;
  const toChainId = transactionData?.to_chain?.chain_id;
  const toTokenAddress = transactionData?.to_token?.token_address;
  const isSameChain = fromChainId === toChainId && toTokenAddress === USDT_POL_ADDRESS;

  const scanLink = generateTxHashLink(
    transactionData?.tx_hash || "",
    isSameChain,
    transactionData?.is_user_operation,
  )

  const [timeElapsed, setTimeElapsed] = useState<string>("00:00");

  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      const now = dayjs();

      const lastInprogressProgress = transactionData?.progress?.filter(progress => progress.status === "completed")
        ?.sort((a, b) => b.index - a.index)?.[0];
      const created = dayjs(lastInprogressProgress?.date);
      const diffMs = now.diff(created, "millisecond");
      setTimeElapsed(formatDuration(diffMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [transactionData?.progress, isCompleted]);

  if (isPendingPayment || isProcessing) {
    return (
      <Container>
        <div className="flex items-center">
          <div
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center timer-animation p-1.5 relative mr-3",
              "bg-white",
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
              <span id="timer" className="font-medium text-[#003E2C]">
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

  if (isFailed || isCancel) {
    return (
      <Container>
        <div className="flex items-center">
          <div
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center timer-animation p-1.5 relative mr-3",
              "bg-white",
            )}
          >
            <Iconify
              name="icon-park-outline:time"
              className="text-xl text-red-600"
            />
          </div>
          <div className="text-[#003E2C] text-sm">
            <div>
              Transaction {isFailed ? "Reverted" : "Cancelled"}{" "}
              <span className="font-medium text-red-600">
                {isFailed ? "REVERTED" : "CANCELLED"}
              </span>
            </div>
            <div className="text-xs">
              {isFailed
                ? "Please contact our Customer Support"
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
            "bg-white",
          )}
        >
          <Iconify
            name="lucide:check-circle"
            className="text-2xl text-green-600"
          />
        </div>
        <div className="w-full">
          <div className="text-sm text-[#003E2C]">Transaction Hash</div>
          <RenderIf isTrue={!isCompleted && isSameChain}>
            <Tooltip title={<div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="animate-spin w-4 h-4 text-[#003E2C]" />
              <p className="text-xs">Transaction is being processed by the bundler</p>
            </div>}>
              <p className="cursor-pointer text-xs underline text-[#6A9080] hover:text-[#2D5C47]">
                {textWithCenterEllipsis(transactionData?.tx_hash || "N/A", 15, 15)}
              </p>
            </Tooltip>
          </RenderIf>

          <RenderIf isTrue={isCompleted || !isSameChain}>
            <a
              href={scanLink}
              target="_blank"
              className="text-xs underline text-[#6A9080] hover:text-[#2D5C47]"
            >
              {textWithCenterEllipsis(transactionData?.tx_hash || "N/A", 15, 15)}
            </a>
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

export default PaymentStatus;
