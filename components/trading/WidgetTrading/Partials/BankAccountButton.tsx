"use client";

import { Iconify } from "@/components/icon/Iconify";
import { useModal } from "@/context/ModalContext";
import { textWithStartEllipsis } from "@/helper/string";
import { useReceivingAccountStore } from "@/store/receivingAccountStore";
import { useTradingAuthStore } from "@/store/tradingAuthStore";
import clsx from "clsx";
import { ArrowDownUp } from "lucide-react";
import { useEffect, type FC } from "react";

interface BankAccountButtonProps {
    onClose?: () => void;
    onAdd?: () => void;
}
const BankAccountButton: FC<BankAccountButtonProps> = ({ onClose, onAdd }) => {
    const { selectedAccount: receivingAccount, setSelectedAccount } = useReceivingAccountStore();
    const { loginSession } = useTradingAuthStore();
    const { delete: confirmDelete, close } = useModal();

    const isDisabled = !loginSession;

    useEffect(() => {
        if (!loginSession) {
            setSelectedAccount(null)
        }
    }, [loginSession, setSelectedAccount])

    const handleDelete = () => {
        confirmDelete({
            title: "Delete Receiving Account? ",
            icon: <ArrowDownUp className="w-8 h-8 text-[#ECF0EF]" />,
            confirmText: "Yes, Delete",
            description: (
                <div className="flex flex-col gap-1 w-full text-center">
                    <div className="text-[#003E2C]">
                        <span className="text-sm opacity-80">Account: </span>
                        <span className="font-semibold">{receivingAccount?.bankName} {textWithStartEllipsis(receivingAccount?.bankAccountNumber || '', 5)}</span>
                    </div>
                </div>
            ),
            onConfirm: async () => {
                onClose?.()
                close()
            },
        });
    }
    return (
        <button
            type="button"
            disabled={isDisabled}
            className={clsx(
                "flex items-center gap-2 rounded-lg bg-white py-1 px-2",
                isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-white/90 hover:ring-1 hover:ring-[#003E2C]"
            )}
            onClick={onAdd}
        >
            <span className="text-sm text-[#003E2C] capitalize">{receivingAccount ? `${receivingAccount?.bankName}` : "Add Account"}</span>
            {receivingAccount && (
                <span
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete()
                    }}
                    className="cursor-pointer flex items-center justify-center rounded-full bg-[#CBF23D] hover:bg-[#CBF23D]/80 p-0.5"
                >
                    <Iconify name="material-symbols:close" className="text-[#003E2C] text-xs" />
                </span>
            )}
        </button>
    );
};

export default BankAccountButton;
