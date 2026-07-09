"use client";

import RenderIf from "@/components/Renderif";
import { Input } from "@/components/form/input";
import { PrimaryHeader } from "@/components/header/PrimaryHeader";
import { Iconify } from "@/components/icon/Iconify";
import { Skeleton } from "@/components/skeleton";
import clsx from "clsx";
import { useNavigate } from "@/lib/router-compat";
import TransactionItem from "./Partials/TransactionItem";
import { useWidgetTransactionHistoryAction } from "./WidgetTransactionHistory.action";

const WidgetTransactionHistory = () => {
  const navigate = useNavigate();
  const {
    transactions,
    isLoading,
    isFetching,
    handleContactSupport,
    handleSearchChange,
    scrollContainerRef,
    search,
  } = useWidgetTransactionHistoryAction()

  return (
    <div className="flex flex-col gap-4 py-5 flex-1 min-h-0">
      <div id="transaction-history-header" className="shrink-0 space-y-4">
        <PrimaryHeader
          title="Transaction History"
          className={clsx("font-semibold text-xl", "text-[#003E2C] px-5")}
          prevBtn={() => navigate(-1)}
        />

        <div className="px-5">
          <Input
            variant="light"
            inputClassName="!bg-[#F4F7F6] !border !border-[#E6ECEA] !rounded-[12px] !shadow-none !text-[#003E2C] !px-3 !py-2.5"
            placeholder="Search transaction ..."
            value={search}
            onChange={handleSearchChange}
            icon='mdi:search'
            hasPrefixIcon
            type="text"
          />
        </div>
      </div>

      <main
        className={clsx(
          "mt-2 transition-colors duration-300 flex-1 min-h-0 flex flex-col",
          "text-[#003E2C]"
        )}
      >
        <RenderIf isTrue={!isLoading && transactions.length > 0}>
          <div
            className={clsx(
              "flex flex-col gap-4 overflow-y-auto px-5 flex-1 min-h-0",
            )}
            ref={scrollContainerRef}
          >
            {transactions.map((trx, index) => <TransactionItem key={`${trx.transactionId}-${index}`} trx={trx} />)}

            <RenderIf isTrue={isFetching}>
              <div className="flex justify-center items-center">
                <Iconify
                  name="mdi:loading"
                  className={clsx(
                    "text-2xl",
                    "text-[#6A9080]",
                    "animate-spin"
                  )}
                />
              </div>
            </RenderIf>
          </div>
        </RenderIf>

        <RenderIf isTrue={isLoading}>
          <div className="flex flex-col gap-2 overflow-y-auto px-5 flex-1 min-h-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-30 w-full" key={index} />
            ))}
          </div>
        </RenderIf>

        <RenderIf isTrue={!isLoading && transactions.length === 0}>
          <div
            className={clsx(
              "flex flex-col items-center justify-center text-center px-5 py-10 rounded-lg flex-1",
              "text-[#6A9080]"
            )}
          >
            <Iconify
              name="mdi:history"
              className={clsx(
                "text-5xl mb-3",
                "text-[#6A9080]"
              )}
            />
            <p className="text-base font-medium">
              You don’t have any transactions yet.
            </p>
            <p className="text-sm mt-1">
              Start by buying or selling crypto to see your history here.
            </p>
          </div>
        </RenderIf>

        <div className="sticky bottom-0 px-5 mt-3">
          <button
            onClick={handleContactSupport}
            className={clsx(
              "w-full font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors",
              "bg-[#CBF23D] hover:bg-[#CBF23D] text-[#003E2C]"
            )}
          >
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
};

export default WidgetTransactionHistory;