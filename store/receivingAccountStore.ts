import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReceivingAccount {
    id: string;
    bankAccountNumber: string;
    bankAccountName: string;
    bankCode: string;
    bankName: string;
    maxAmountTransfer: number;
    logoUrl?: string;
}

interface ReceivingAccountState {
    selectedAccount: ReceivingAccount | null;
    setSelectedAccount: (account: ReceivingAccount | null) => void;
    clearSelectedAccount: () => void;
}

export const useReceivingAccountStore = create<ReceivingAccountState>()(
    persist(
        (set) => ({
            selectedAccount: null,

            setSelectedAccount: (account) => set({ selectedAccount: account }),

            clearSelectedAccount: () => set({ selectedAccount: null }),
        }),
        {
            name: "receiving-account-storage",
        }
    )
);
