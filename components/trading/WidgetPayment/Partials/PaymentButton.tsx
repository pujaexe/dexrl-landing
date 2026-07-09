"use client";

import { getMintRequest } from "@/api/transactionService";
import { useModal } from "@/context/ModalContext";
import { notification } from "@/components/ui/toast";
import clsx from "clsx";
import { RefreshCcwIcon, XIcon } from "lucide-react";
import type { ButtonHTMLAttributes, FC } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "@/lib/router-compat";
import useTransaction from "../../hooks/useTransaction";
import type { TransactionData } from "../WidgetPayment.types";

interface IPaymentButtonProps {
  transactionData?: TransactionData;
}

const PaymentButton: FC<IPaymentButtonProps> = ({
  transactionData,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { username } = useParams();

  const isFailed = transactionData?.status === "failed";
  const isCompleted = transactionData?.status === "completed";
  const inProgress = ["inprogress", "settlement", "executing", "routing"].includes(transactionData?.status || "");
  const isPending = transactionData?.status === "pending";
  const isCancelled = transactionData?.status === "cancelled";

  const { confirm, close } = useModal();
  const { updateTransactionAsync, updateTransactionProgressAsync } = useTransaction();

  const handleCancelOrder = async () => {
    confirm({
      title: "Cancel transaction?",
      icon: <XIcon className="w-8 h-8 text-[#ECF0EF]" />,
      description: "Are you sure you want to cancel? Any progress will be lost and you will need to start over.",
      cancelText: "Go Back",
      confirmText: "Yes, Cancel",
      onConfirm: async () => {
        await updateTransactionAsync({
          updated_at: new Date(),
          status: "cancelled",
        });
        await updateTransactionProgressAsync("LAST_STEP", "cancelled");
        close();
      },
    });
  };

  const handleRetry = async () => {
    confirm({
      title: "Retry Transaction?",
      icon: <RefreshCcwIcon className="w-8 h-8 text-[#ECF0EF]" />,
      description: "Are you sure you want to retry this transaction? This action cannot be undone.",
      onConfirm: async () => {
        await updateTransactionAsync({
          updated_at: new Date(),
          status: "routing",
        });
        await updateTransactionProgressAsync("RETRY", "inprogress");
        close();
      },
    });
  };

  const handleProceedToIdrx = async () => {
    if (!transactionData?.payment_ref) {
      console.error("Payment reference not found");
      return;
    }

    setIsLoading(true);
    try {
      const mintRequest = await getMintRequest(transactionData.payment_ref);
      const paymentUrl = mintRequest?.payment_url;

      if (paymentUrl) {
        const anchor = document.createElement("a");
        Object.assign(anchor, {
          target: "_blank",
          rel: "noopener noreferrer",
          href: paymentUrl,
        });
        anchor.click();
      } else {
        api.error({
          message: "Payment URL not found in mint request",
          description: "Please contact support for assistance.",
          placement: "topRight",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Failed to get payment URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSupport = () => {
    const contactSupport = "https://wa.me/6281214690096";
    const anchor = document.createElement("a");
    Object.assign(anchor, {
      target: "_blank",
      rel: "noopener noreferrer",
      href: contactSupport,
    });
    anchor.click();
  };

  const handleViewHistory = () => {
    navigate(`/${username}/transaction-history`);
  };

  const handleNewTransaction = () => {
    navigate(`/${username}`);
  };

  return (
    <div className="flex justify-between gap-4 w-full">
      {contextHolder}
      {/* LEFT */}
      {isPending && (
        <ButtonComponent
          variant="outline"
          onClick={handleCancelOrder}
          disabled={isLoading}
        >
          Cancel Order
        </ButtonComponent>
      )}

      {isFailed && (
        <ButtonComponent
          variant="outline"
          onClick={handleRetry}
          disabled={isLoading}
        >
          Retry
        </ButtonComponent>
      )}

      {(inProgress || isCompleted || isCancelled) && (
        <ButtonComponent
          variant="outline"
          onClick={handleViewHistory}
        >
          View History
        </ButtonComponent>
      )}

      {/* RIGHT */}
      {isPending && (
        <ButtonComponent
          variant="solid"
          onClick={handleProceedToIdrx}
          disabled={isLoading || !transactionData?.payment_ref}
        >
          Proceed to IDRX
        </ButtonComponent>
      )}

      {isFailed && (
        <ButtonComponent
          variant="solid"
          onClick={handleCustomerSupport}
        >
          Customer Support
        </ButtonComponent>
      )}

      {inProgress && (
        <ButtonComponent
          variant="solid"
          disabled
        >
          Processing
        </ButtonComponent>
      )}

      {(isCompleted || isCancelled) && (
        <ButtonComponent
          variant="solid"
          onClick={handleNewTransaction}
        >
          New Transaction
        </ButtonComponent>
      )}
    </div>
  );
};

interface IButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

const ButtonComponent: FC<IButtonComponentProps> = ({
  variant = "solid",
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        variant === "solid" &&
        "w-full font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors bg-[#CBF23D] hover:bg-[#CBF23D] text-[#003E2C] cursor-pointer disabled:bg-[#ECF0EF] disabled:text-[#6A9080] disabled:cursor-not-allowed",
        variant === "outline" &&
        "w-full border border-solid border-[#CBF23D] text-[#003E2C] hover:bg-[#CBF23D]/10 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:border-[#C2CFCB] disabled:text-[#6A9080] disabled:bg-transparent disabled:cursor-not-allowed",
        props.className
      )}>
      {props.children}
    </button>
  );
};

export default PaymentButton;
