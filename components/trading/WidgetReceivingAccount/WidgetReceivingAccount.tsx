"use client";

import { PrimaryHeader } from "@/components/header/PrimaryHeader";
import { Icon } from "@/components/icon/Icon";
import Popover from "@/components/Popover";
import TradingInput from "@/components/trading/WidgetTrading/Partials/TradingInput";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import { Select } from "@/components/ui/Select";
import { useWidgetReceivingAccountAction } from "./WidgetReceivingAccount.action";

const WidgetReceivingAccount = () => {
    const {
        form,
        errors,
        selectedBank,
        verifiedAccount,
        maskedAccountName,
        bankOptions,
        isLoadingBanks,
        isVerifying,
        isSaving,
        isVerifyDisabled,
        isSaveDisabled,
        notificationContextHolder,
        handleVerify,
        handleSave,
        handleCancel,
        handleBack,
    } = useWidgetReceivingAccountAction();

    return (
            <div
                className="flex flex-col gap-4 p-5 flex-1"
            >
                {notificationContextHolder}

                <PrimaryHeader
                    title="Receiving Account"
                    className={clsx("font-semibold text-xl", "text-[#003E2C]")}
                    prevBtn={handleBack}
                />

                <form className="flex flex-col gap-4 mt-2">
                    {/* Bank Selection */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <label className="font-semibold text-[#003E2C]">Bank</label>
                            <Popover
                                title="Bank Information"
                                content="Select your bank for receiving funds. Settlement fee will be deducted from your transfer amount."
                            >
                                <div className="w-4 h-4 rounded-full bg-[#ECF0EF] border border-[#C2CFCB] flex items-center justify-center cursor-pointer">
                                    <Icon name="question" className="text-[#6A9080] text-[10px]" />
                                </div>
                            </Popover>
                        </div>

                        <Controller
                            name="selectedBank"
                            control={form.control}
                            render={({ field }) => (
                                <Select
                                    showSearch
                                    placeholder="Select Bank"
                                    options={bankOptions}
                                    loading={isLoadingBanks}
                                    status={errors.selectedBank ? "error" : undefined}
                                    value={field.value || null}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                        {errors.selectedBank && (
                            <p className="text-xs text-red-500 mt-1">{errors.selectedBank.message}</p>
                        )}

                        {/* Redeem Fee Info */}
                        {selectedBank && (
                            <p className="text-xs text-[#6A9080] mt-1">
                                Redeem Fee: IDR 5.000
                            </p>
                        )}
                    </div>

                    {/* Account Number Input */}
                    <div className="flex flex-col gap-1 relative">
                        <Controller
                            name="accountNumber"
                            control={form.control}
                            render={({ field }) => (
                                <>
                                    <TradingInput
                                        label="Recipient Account Number"
                                        placeholder="Input Recipient Account Number"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        readOnly={!selectedBank}
                                        className={clsx(
                                            !selectedBank && "opacity-50",
                                            "text-base! h-[54px]!"
                                        )}
                                    />
                                    {errors.accountNumber && (
                                        <p className="text-xs text-red-500 absolute -bottom-4.5 left-0">
                                            {errors.accountNumber.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Account Holder Name - Only show when verified */}
                    {verifiedAccount && (
                        <div className="flex flex-col gap-1 relative">
                            <TradingInput
                                label="Account Holder Name"
                                placeholder=""
                                value={maskedAccountName}
                                readOnly
                                className={clsx(
                                    "text-base! h-[54px]!"
                                )}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        {!verifiedAccount ? (
                            <button
                                type="button"
                                onClick={handleVerify}
                                disabled={isVerifyDisabled}
                                className={clsx(
                                    "w-full py-3 rounded-lg font-semibold text-base",
                                    "transition-all duration-200",
                                    isVerifyDisabled
                                        ? "bg-[#ECF0EF] text-[#6A9080] cursor-not-allowed"
                                        : "bg-[#CBF23D] text-[#003E2C] hover:bg-[#bce62f] cursor-pointer"
                                )}
                            >
                                {isVerifying ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-[#C2CFCB] border-t-transparent rounded-full animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify Destination"
                                )}
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={clsx(
                                        "flex-1 py-3 rounded-lg font-semibold text-base",
                                        "transition-all duration-200",
                                        "border border-[#C2CFCB] text-[#003E2C] hover:bg-[#ECF0EF] cursor-pointer"
                                    )}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaveDisabled}
                                    className={clsx(
                                        "flex-1 py-3 rounded-lg font-semibold text-base",
                                        "transition-all duration-200",
                                        isSaveDisabled
                                            ? "bg-[#ECF0EF] text-[#6A9080] cursor-not-allowed"
                                            : "bg-[#CBF23D] text-[#003E2C] hover:bg-[#bce62f] cursor-pointer"
                                    )}
                                >
                                    {isSaving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-[#C2CFCB] border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : (
                                        "Save Bank Account"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
    );
};

export default WidgetReceivingAccount;
