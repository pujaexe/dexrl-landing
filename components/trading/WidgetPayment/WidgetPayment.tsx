"use client";

import { useTradingFormStore } from "@/store/tradingFormStore";
import clsx from "clsx";
import ModalSuccess from "./Partials/ModalSuccess";
import PaymentButton from "./Partials/PaymentButton";
import PaymentHeader from "./Partials/PaymentHeader";
import { PaymentSkeleton } from "./Partials/PaymentSkeleton";
import PaymentStatus from "./Partials/PaymentStatus";
import PaymentStep from "./Partials/PaymentStep";
import useWidgetPaymentAction from "./WidgetPayment.action";
import { AdminActionsPanelGate } from "../AdminActionsPanel";

const WidgetPayment = () => {
  const {
    transactionData,
    isLoadingTransaction,
    errorTransaction,
  } = useWidgetPaymentAction();

  const { isOpenModalSuccess, onCloseModalSuccess } = useTradingFormStore();

  if (isLoadingTransaction) {
    return (
      <div className="flex flex-col w-full max-w-[454px] gap-4 p-4">
        <PaymentSkeleton />
      </div>
    );
  }

  if (errorTransaction) {
    return (
      <div className="flex flex-col w-full max-w-[454px] gap-4 p-4">
        <div className="text-[#003E2C] text-center">Transaction not found.</div>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col w-full max-w-[454px] gap-4 p-4")}>
      <div className="flex flex-col items-start gap-3 w-full">
        <PaymentHeader steps={transactionData?.progress || []} />

        <PaymentStep transactionData={transactionData} />

        <PaymentStatus transactionData={transactionData} />
      </div>

      <PaymentButton transactionData={transactionData} />

      {transactionData?.trx_no && (
        <AdminActionsPanelGate
          trxNo={transactionData.trx_no}
          trxType="buy"
          status={transactionData?.status}
        />
      )}

      <ModalSuccess
        open={isOpenModalSuccess}
        onClose={onCloseModalSuccess}
        transactionData={transactionData}
      />
    </div>
  );
};

export default WidgetPayment;
