"use client";

import { formatRp, formatTokenInput } from "@/helper/rupiah";
import { textWithCenterEllipsis, textWithStartEllipsis } from "@/helper/string";
import { useTradingFormStore } from "@/store/tradingFormStore";
import clsx from "clsx";
import { useRef } from "react";
import { Controller } from "react-hook-form";
import AmountButtons from "./Partials/AmountButtons";
import AssetSelector from "./Partials/AssetSelector";
import Header from "./Partials/Header";
import Metamask from "./Partials/Metamask";
import ModalConnect from "./Partials/ModalConnect";
import { ModalSelectToken } from "./Partials/ModalSelectToken";
import QuoteEstimation from "./Partials/QuoteEstimation";
import SwapButton from "./Partials/SwapButton";
import TradingAction from "./Partials/TradingAction";
import TradingInput from "./Partials/TradingInput";
import { useWidgetTradingAction } from "./WidgetTrading.action";
const idrxIcon = "/icons/idrx.png";
import BankAccountButton from "./Partials/BankAccountButton";
import TokenIcon from "@/components/icon/TokenIcon";

const WidgetTrading = () => {
    const {
        isOpenSelectToken,
        onOpenSelectToken,
        isOpenConnect,
        onOpenConnect,
        closeModal,
        loginSession,
        form,
        errors,
        handleSubmit,
        isUseMetamaskAddress,

        quoteData,
        isLoadingQuote,
        isErrorQuote,
        isFetchingQuote,
        isEnabledQuote,
        offrampBelowMinimum,
        onrampBelowMinimum,
        insufficientBalance,
        metamaskBalance,
        onSubmitTransaction,
        notificationContextHolder,
        tokenSelectionError,
        selectedToken,
        receivingAccount,
        handleAddBankAccount,
        handleClearBankAccount,
    } = useWidgetTradingAction();
    const { fromToken, toToken, swapTokens, formActive } = useTradingFormStore();
    const addressRef = useRef<HTMLInputElement>(null);
    const isUsingMetamaskAddress =
        loginSession?.provider === "metamask" && isUseMetamaskAddress;

    return (
        <>
            {notificationContextHolder}
            <form id="trading-form" onSubmit={e => e.preventDefault()}>
                <div className={clsx("flex flex-col gap-6 p-5 w-full")}>
                    <Header />

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1 relative">
                            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2.5 relative w-full">
                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6A9080]">From</label>

                                    <AssetSelector
                                        title={fromToken?.symbol || ""}
                                        subtitle={fromToken?.chain?.name || ""}
                                        icon={fromToken?.logoURI || ""}
                                        subTitleColor={fromToken?.chain?.color || "#6A9080"}
                                        isFrom={formActive === "onramp"}
                                        isLeft
                                        onClick={() => {
                                            if (formActive === "offramp") {
                                                onOpenSelectToken();
                                            }
                                        }}
                                        isMaintenance={formActive === "onramp"}
                                    />
                                </div>

                                <div className="flex items-center justify-center h-[64px]">
                                    <SwapButton onClick={swapTokens} />
                                </div>

                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6A9080]">To</label>

                                    <AssetSelector
                                        title={toToken?.symbol || ""}
                                        subtitle={toToken?.chain?.name || ""}
                                        icon={toToken?.logoURI || ""}
                                        subTitleColor={toToken?.chain?.color || "#6A9080"}
                                        isFrom={formActive === "offramp"}
                                        onClick={() => {
                                            if (formActive === "onramp") {
                                                onOpenSelectToken();
                                            }
                                        }}
                                        isMaintenance={formActive === "offramp"}
                                    />
                                </div>
                            </div>
                            {
                                tokenSelectionError && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {tokenSelectionError}
                                    </p>
                                )
                            }
                        </div>

                        <div className="flex flex-col gap-1 relative">
                            <Controller
                                name="amount"
                                control={form.control}
                                render={({ field }) => (
                                    <>
                                        <TradingInput
                                            label="Send"
                                            labelSuffix={formActive === 'offramp' ? (
                                                <AmountButtons
                                                    onSetAmount={(amount) => {
                                                        form.setValue("amount", formatTokenInput(amount), { shouldValidate: true });
                                                    }}
                                                />
                                            ) : undefined}
                                            prefix={
                                                <img src={idrxIcon} alt="IDRX" className="w-10 h-10" />
                                            }
                                            {...(formActive === 'offramp' && {
                                                prefix: (
                                                    <TokenIcon src={selectedToken?.logoURI} alt={selectedToken?.name} size="md" />
                                                )
                                            })}
                                            placeholder="0.00"
                                            value={field.value || ""}
                                            onChange={(e) => {
                                                const formatted = formActive === 'offramp'
                                                    ? formatTokenInput(e.target.value)
                                                    : formatRp(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            onBlur={field.onBlur}
                                        />
                                        {errors.amount && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {errors.amount.message}
                                            </p>
                                        )}
                                        {!errors.amount && insufficientBalance && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Insufficient balance. Available: {metamaskBalance?.toFixed(6)} {selectedToken?.symbol}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {formActive === "onramp" && (
                            <div className="flex flex-col gap-1 relative">
                                <Controller
                                    name="destinationAddress"
                                    control={form.control}
                                    render={({ field }) => (
                                        <>
                                            <TradingInput
                                                label="Destination Address"
                                                placeholder="Input wallet address"
                                                className={clsx(
                                                    "text-base! h-[54px]!",
                                                    loginSession?.provider === "metamask" &&
                                                    isUseMetamaskAddress &&
                                                    "pr-[130px]!",
                                                )}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    form.trigger("destinationAddress");
                                                }}
                                                onBlur={field.onBlur}
                                                {...(isUsingMetamaskAddress && {
                                                    suffix: (
                                                        <Metamask />
                                                    ),
                                                    readOnly:
                                                        !loginSession || loginSession?.provider === "metamask",
                                                    value: textWithCenterEllipsis(field.value || "", 15, 5),
                                                })}
                                                ref={addressRef}
                                            />
                                            {errors.destinationAddress && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {errors.destinationAddress.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        )}

                        {formActive === "offramp" && (
                            <div className="flex flex-col gap-1 relative">
                                <Controller
                                    name="receivingAccount"
                                    control={form.control}
                                    render={({ field }) => (
                                        <>
                                            <TradingInput
                                                label="Receiving Account"
                                                placeholder="No Account Yet"
                                                className={clsx(
                                                    "text-base! h-[54px]!",
                                                    "pr-[130px]!",
                                                )}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    form.trigger("receivingAccount");
                                                }}
                                                onBlur={field.onBlur}
                                                suffix={
                                                    <BankAccountButton
                                                        onAdd={handleAddBankAccount}
                                                        onClose={handleClearBankAccount}
                                                    />
                                                }
                                                readOnly
                                                value={receivingAccount ? textWithStartEllipsis(receivingAccount.bankAccountNumber, 5) : ""}
                                                ref={addressRef}
                                            />
                                            {errors.receivingAccount && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {errors.receivingAccount.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        )}

                        <QuoteEstimation
                            quoteData={quoteData}
                            isErrorQuote={isErrorQuote}
                            isLoadingQuote={isLoadingQuote || isFetchingQuote}
                            isEnabledQuote={isEnabledQuote}
                            offrampBelowMinimum={offrampBelowMinimum}
                            onrampBelowMinimum={onrampBelowMinimum}
                        />

                        <p className="text-sm text-[#6A9080] leading-relaxed border-t border-dashed border-[#D8E3DF] pt-3 -mt-1">
                            Payout goes direct to a bank account. GBP, SGD, and more — handled by licensed delivery partners in each market.
                        </p>

                        <TradingAction
                            form={form}
                            isSubmitting={false}
                            onOpenConnect={onOpenConnect}
                            isLoadingQuote={isLoadingQuote || isFetchingQuote}
                            offrampBelowMinimum={offrampBelowMinimum}
                            onrampBelowMinimum={onrampBelowMinimum}
                            insufficientBalance={insufficientBalance}
                            onSubmitTransaction={handleSubmit(onSubmitTransaction)}
                        />
                    </div>

                    <ModalSelectToken open={isOpenSelectToken} onClose={closeModal} />
                    <ModalConnect open={isOpenConnect} onClose={closeModal} />
                </div>
            </form>
        </>
    );
};

export default WidgetTrading;
