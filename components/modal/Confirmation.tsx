import { Modal } from "@/components/ui/Modal";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ConfirmationProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    title?: string;
    icon?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    children?: React.ReactNode;
}

const Confirmation = ({
    open,
    onClose,
    onConfirm,
    isLoading = false,
    title = "Are you sure?",
    icon = <AlertTriangleIcon className="w-8 h-8 text-[#ECF0EF]" />,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false,
    children,
}: ConfirmationProps) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            closable={false}
            styles={{
                content: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #C2CFCB',
                },
                body: {
                    padding: '24px',
                },
            }}
        >
            <div className="flex flex-col items-center gap-6">
                <div className={clsx(
                    "w-16 h-16 rounded-full flex items-center justify-center",
                    isDanger ? "bg-[#E5484D]" : "bg-[#003E2C]"
                )}>
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-[#003E2C] text-center">
                    {title}
                </h2>

                <div className="w-full text-center text-sm text-[#2D5C47]">
                    {children}
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={clsx(
                            "h-11 font-semibold rounded-full cursor-pointer",
                            "bg-transparent border border-[#C2CFCB] text-[#003E2C]",
                            "hover:bg-[#ECF0EF]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors duration-200",
                            "flex items-center justify-center"
                        )}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={clsx(
                            "h-11 font-semibold rounded-full cursor-pointer",
                            isDanger ? "bg-[#E5484D] text-white hover:bg-[#cf3f44]" : "bg-[#CBF23D] border-0 text-[#003E2C]",
                            isDanger ? "" : "hover:bg-[#b8d934]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors duration-200",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {isLoading && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default Confirmation;
