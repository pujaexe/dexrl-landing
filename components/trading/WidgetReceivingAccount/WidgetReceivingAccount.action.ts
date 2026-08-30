"use client";

import { addBankAccount, checkBankAccountInIdrx } from "@/services/oxo/idrx/idrx";
import { getBankTransferList, saveBank } from "@/services/bankService";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useReceivingAccountStore, type ReceivingAccount } from "@/store/receivingAccountStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "@/components/ui/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "@/lib/router-compat";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface BankTransferOption {
    bankName: string;
    bankCode: string;
    logoUrl: string;
    maxAmountTransfer: number;
}

// Zod schema for form validation
const receivingAccountSchema = z.object({
    selectedBank: z.string().min(1, "Please select a bank"),
    accountNumber: z.string().min(1, "Account number is required"),
});

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

export type ReceivingAccountFormData = z.infer<typeof receivingAccountSchema>;

export const useWidgetReceivingAccountAction = () => {
    const navigate = useNavigate();
    const { username = "trade" } = useParams();
    const [api, contextHolder] = notification.useNotification();
    const { wallet } = useTradingAuthStore();
    const { setSelectedAccount } = useReceivingAccountStore();

    const [verifiedAccount, setVerifiedAccount] = useState<{
        id: number;
        bankAccountName: string;
        bankAccountNumber: string;
        bankCode: string;
        bankName: string;
        maxAmountTransfer: number;
    } | null>(null);

    // Track if the verified account already existed in IDRX (so we don't delete on cancel)
    const existedInIdrxRef = useRef(false);

    // React Hook Form
    const form = useForm<ReceivingAccountFormData>({
        resolver: zodResolver(receivingAccountSchema),
        defaultValues: {
            selectedBank: "",
            accountNumber: "",
        },
        mode: "onChange",
    });

    const { watch } = form;
    const selectedBankCode = watch("selectedBank");
    const accountNumber = watch("accountNumber");

    // Fetch bank transfer list
    const { data: bankTransfers = [], isLoading: isLoadingBanks } = useQuery({
        queryKey: ["bankTransfers"],
        queryFn: async () => {
            const res = await getBankTransferList();
            return res.map((bank: any) => ({
                bankName: bank.bank_name,
                bankCode: bank.bank_code,
                logoUrl: bank.logo_url,
                maxAmountTransfer: bank.max_amount_transfer,
            })) as BankTransferOption[];
        },
    });

    // Convert bank transfers to Select options
    const bankOptions = useMemo(() => {
        return bankTransfers.map((bank) => ({
            value: bank.bankCode,
            label: bank.bankName,
        }));
    }, [bankTransfers]);

    // Get selected bank object
    const selectedBank = useMemo(() => {
        return bankTransfers.find((bank) => bank.bankCode === selectedBankCode) || null;
    }, [bankTransfers, selectedBankCode]);

    // Reset verified account when bank or account number changes
    useEffect(() => {
        setVerifiedAccount(null);
        existedInIdrxRef.current = false;
    }, [selectedBankCode, accountNumber]);

    // Verify bank account
    // Flow: Check if exists in IDRX first, if yes use that data, if no add to IDRX
    const verifyMutation = useMutation({
        mutationFn: async () => {
            if (!selectedBank || !accountNumber) {
                throw new Error("Please select bank and enter account number");
            }

            // Step 1: Check if bank account already exists in IDRX for current user
            const existingAccount = await checkBankAccountInIdrx(accountNumber);

            if (existingAccount) {
                // Bank already exists in IDRX, use existing data (skip addBankAccount)
                existedInIdrxRef.current = true;
                return {
                    id: existingAccount.id,
                    bankAccountName: existingAccount.bankAccountName,
                    bankAccountNumber: existingAccount.bankAccountNumber,
                    bankCode: existingAccount.bankCode,
                    bankName: existingAccount.bankName,
                    maxAmountTransfer: Number(existingAccount.maxAmountTransfer) || selectedBank.maxAmountTransfer,
                };
            }

            // Step 2: Bank doesn't exist in IDRX, add it
            existedInIdrxRef.current = false;
            const result = await addBankAccount({
                bankCode: selectedBank.bankCode,
                bankAccountNumber: accountNumber,
            });

            return result.data;
        },
        onSuccess: (data) => {
            setVerifiedAccount(data);
            const message = existedInIdrxRef.current
                ? "Account Found"
                : "Account Verified";
            api.success({
                message,
                description: `Account holder: ${data.bankAccountName}`,
                placement: "topRight",
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.message?.toLowerCase() || "";
            if (errorMessage.includes("already exist")) {
                // Bank registered by another user in IDRX
                api.error({
                    message: "Account Already Registered",
                    description: "This bank account is already registered by another user.",
                    placement: "topRight",
                });
            } else {
                api.error({
                    message: "Verification Failed",
                    description: error?.message || "Failed to verify bank account",
                    placement: "topRight",
                });
            }
        },
    });

    // Save bank account
    const saveMutation = useMutation({
        mutationFn: async () => {
            if (!verifiedAccount || !selectedBank || !wallet?.addressRecord?.id) {
                throw new Error("Missing required data");
            }

            const result = await saveBank(wallet.addressRecord.id, {
                bankAccountNumber: verifiedAccount.bankAccountNumber,
                bankAccountName: verifiedAccount.bankAccountName,
                bankCode: verifiedAccount.bankCode,
                bankName: verifiedAccount.bankName,
                maxAmountTransfer: verifiedAccount.maxAmountTransfer,
                logoUrl: selectedBank.logoUrl,
            });

            return result;
        },
        onSuccess: (result) => {
            const account: ReceivingAccount = {
                id: result.id,
                bankAccountNumber: verifiedAccount!.bankAccountNumber,
                bankAccountName: verifiedAccount!.bankAccountName,
                bankCode: verifiedAccount!.bankCode,
                bankName: verifiedAccount!.bankName,
                maxAmountTransfer: verifiedAccount!.maxAmountTransfer,
                logoUrl: selectedBank?.logoUrl,
            };

            setSelectedAccount(account);

            api.success({
                message: "Account Saved",
                description: "Bank account has been saved successfully",
                placement: "topRight",
            });

            // Navigate back to trading page
            navigate(`/${username}`);
        },
        onError: (error: any) => {
            api.error({
                message: "Save Failed",
                description: error?.message || "Failed to save bank account",
                placement: "topRight",
            });
        },
    });

    const handleVerify = () => {
        verifyMutation.mutate();
    };

    const handleSave = () => {
        saveMutation.mutate();
    };

    // Cancel - just confirm and navigate back
    const handleCancel = () => {
        setVerifiedAccount(null);
        existedInIdrxRef.current = false;
        api.success({
            message: "Account Cancelled",
            description: "Bank account verification has been cancelled",
            placement: "topRight",
        });
        navigate(-1);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const isVerifyDisabled = !selectedBank || !accountNumber || verifyMutation.isPending;
    const isSaveDisabled = !verifiedAccount || saveMutation.isPending;
    const maskedAccountName = verifiedAccount ? maskName(verifiedAccount.bankAccountName) : "";

    return {
        // Form
        form,
        errors: form.formState.errors,

        // State
        selectedBank,
        verifiedAccount,
        maskedAccountName,
        bankOptions,
        isLoadingBanks,
        isVerifying: verifyMutation.isPending,
        isSaving: saveMutation.isPending,
        isVerifyDisabled,
        isSaveDisabled,
        notificationContextHolder: contextHolder,

        // Actions
        handleVerify,
        handleSave,
        handleCancel,
        handleBack,
    };
};
