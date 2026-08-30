"use client";

import { getBankList } from "@/services/bankService";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import { useReceivingAccountStore, type ReceivingAccount } from "@/store/receivingAccountStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@/lib/router-compat";

export const useWidgetReceivingAccountListAction = () => {
    const { wallet } = useTradingAuthStore();
    const { setSelectedAccount } = useReceivingAccountStore();
    const navigate = useNavigate();
    const { username = "trade" } = useParams();

    const addressId = wallet?.addressRecord?.id || "";

    const {
        data: bankAccounts = [],
        isLoading: isLoadingAccounts,
        isError: isErrorAccounts,
    } = useQuery({
        queryKey: ["bankList", addressId],
        queryFn: () => getBankList(addressId),
        enabled: !!addressId,
    });

    const handleSelectAccount = (account: any) => {
        const receivingAccount: ReceivingAccount = {
            id: account.id,
            bankAccountNumber: account.bank_account_number,
            bankAccountName: account.bank_account_name,
            bankCode: account.bank_code,
            bankName: account.bank_name,
            maxAmountTransfer: account.max_amount_transfer,
            logoUrl: account.logo_url,
        };
        setSelectedAccount(receivingAccount);
        navigate(`/${username}`);
    };

    const handleAddNew = () => {
        navigate(`/${username}/receiving-account/add`);
    };

    const handleBack = () => {
        navigate(`/${username}`);
    };

    return {
        bankAccounts,
        isLoadingAccounts,
        isErrorAccounts,
        handleSelectAccount,
        handleAddNew,
        handleBack,
    };
};
