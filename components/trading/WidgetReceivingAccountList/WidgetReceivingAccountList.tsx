"use client";

import { PrimaryHeader } from "@/components/header/PrimaryHeader";
import { Icon } from "@/components/icon/Icon";
import clsx from "clsx";
import { useWidgetReceivingAccountListAction } from "./WidgetReceivingAccountList.action";
import { textWithStartEllipsis } from "@/helper/string";

// Mask name function: "Rina Ahmad Gunawan" -> "R**a A***d G*****n"
const maskName = (name: string): string => {
    if (!name) return "";
    return name
        .split(" ")
        .map((word) => {
            if (word.length <= 2) return word;
            const first = word[0];
            const last = word[word.length - 1];
            const middle = "*".repeat(word.length - 2);
            return `${first}${middle}${last}`;
        })
        .join(" ");
};

const WidgetReceivingAccountList = () => {
    const {
        bankAccounts,
        isLoadingAccounts,
        isErrorAccounts,
        handleSelectAccount,
        handleAddNew,
        handleBack,
    } = useWidgetReceivingAccountListAction();


    // Show loading state
    if (isLoadingAccounts) {
        return (
            <div
                className="flex flex-col gap-4 p-5 flex-1"
            >
                <PrimaryHeader
                    title="Select Account"
                    className={clsx("font-semibold text-xl", "text-[#003E2C]")}
                    prevBtn={handleBack}
                />
                <div className="flex items-center justify-center py-10">
                    <span className="w-6 h-6 border-2 border-[#C2CFCB] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    // Show error state
    if (isErrorAccounts) {
        return (
            <div
                className="flex flex-col gap-4 p-5 flex-1"
            >
                <PrimaryHeader
                    title="Select Account"
                    className={clsx("font-semibold text-xl", "text-[#003E2C]")}
                    prevBtn={handleBack}
                />
                <div className="flex flex-col items-center justify-center py-10 text-[#6A9080]">
                    <p>Failed to load accounts</p>
                    <button
                        onClick={handleBack}
                        className="mt-2 text-sm text-[#003E2C] hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col gap-4 p-5 flex-1"
        >
            <PrimaryHeader
                title="Select Account"
                className={clsx("font-semibold text-xl", "text-[#003E2C]")}
                prevBtn={handleBack}
            />

            <div className="flex flex-col gap-3 mt-2">
                {/* Account List */}
                {bankAccounts.map((account: any) => (
                    <button
                        key={account.id}
                        type="button"
                        onClick={() => handleSelectAccount(account)}
                        className={clsx(
                            "w-full flex items-center justify-between",
                            "bg-[#ECF0EF]/60 rounded-xl p-4",
                            "text-[#003E2C] cursor-pointer",
                            "hover:bg-[#ECF0EF] transition-colors",
                        )}
                    >
                        <div className="flex flex-col items-start gap-1">
                            <span className="font-medium">{account.bank_name}</span>
                            <span className="text-sm text-[#6A9080]">
                                {textWithStartEllipsis(account.bank_account_number, 5)} - {maskName(account.bank_account_name)}
                            </span>
                        </div>
                        <Icon name="chevron-right" className="text-[#6A9080]" />
                    </button>
                ))}

                {/* Add New Account Button */}
                <button
                    type="button"
                    onClick={handleAddNew}
                    className={clsx(
                        "w-full flex items-center justify-center gap-2",
                        "bg-transparent rounded-xl py-3",
                        "text-[#003E2C] cursor-pointer",
                        "hover:bg-[#ECF0EF]/50 transition-colors",
                        "border border-dashed border-[#C2CFCB] hover:border-[#003E2C]"
                    )}
                >
                    <Icon name="plus" className="text-lg" />
                    <span className="font-medium">Add New Account</span>
                </button>
            </div>
        </div>
    );
};

export default WidgetReceivingAccountList;
