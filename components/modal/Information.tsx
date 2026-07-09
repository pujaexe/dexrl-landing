import { Modal } from "@/components/ui/Modal";
import clsx from "clsx";
import { Iconify } from "../icon/Iconify";

interface InformationProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

const Information = ({
    open,
    onClose,
    title = "No Swap Route Found",
    icon = <Iconify name="material-symbols:route-outline" className="text-white text-4xl" />,
    children,
}: InformationProps) => {
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
                    backgroundColor: '#1A1A1A',
                    borderRadius: '12px',
                    border: '1px solid #2D2D2D',
                },
                body: {
                    padding: '24px',
                },
            }}
        >
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#525AF3] flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-white text-center">
                    {title}
                </h2>

                <div className="w-full text-center text-sm text-white">
                    {children}
                </div>

                <button
                    onClick={onClose}
                    className={clsx(
                        "h-11 font-semibold rounded-lg cursor-pointer w-full",
                        "bg-[#525AF3] border-0 text-white",
                        "hover:bg-[#4248d9]",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-colors duration-200",
                        "flex items-center justify-center gap-2"
                    )}
                >
                    <span>Understand</span>
                </button>
            </div>
        </Modal>
    );
};

export default Information;
