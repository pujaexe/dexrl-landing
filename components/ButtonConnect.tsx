import { Loader2 } from "lucide-react";
import clsx from "clsx";
import type { FC } from "react";
import MaintenanceMessage from "./MaintenanceMessage";
import { Iconify } from "./icon/Iconify";

interface IProps {
    isMaintenance?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
    icon: string;
    title: string;
    isCenter?: boolean;
    className?: string;
}
const ButtonConnect: FC<IProps> = ({
    isMaintenance,
    isLoading,
    onClick,
    icon,
    title,
    isCenter,
    className,
}) => {
    return (
        <MaintenanceMessage isMaintenance={isMaintenance}>
            <button
                className={clsx(
                    "flex items-center gap-3 w-full py-3 px-4 rounded-[10px] border border-[#C2CFCB]",
                    "transition-colors cursor-pointer h-12 hover:bg-[#ECF0EF]",
                    "text-[#003E2C] disabled:opacity-50 disabled:cursor-not-allowed",
                    isCenter && "justify-center",
                    className
                )}
                onClick={onClick}
                disabled={isLoading || isMaintenance}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#003E2C]" />
                ) : (
                    <Iconify name={icon} className="text-2xl" />
                )}
                <span className="text-sm">{isLoading ? "Loading..." : title}</span>
            </button>
        </MaintenanceMessage>
    );
};

export default ButtonConnect;
