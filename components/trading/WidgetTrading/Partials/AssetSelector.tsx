"use client";

import MaintenanceMessage from "@/components/MaintenanceMessage";
import TokenIcon from "@/components/icon/TokenIcon";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";

interface AssetSelectorProps {
    icon: string;
    title: string;
    subtitle: string;
    subTitleColor: string;
    isFrom?: boolean;
    isLeft?: boolean;
    onClick: () => void;
    isMaintenance?: boolean;
}
const AssetSelector = ({
    icon,
    title,
    subtitle,
    subTitleColor,
    isFrom,
    isLeft,
    onClick,
    isMaintenance,
}: AssetSelectorProps) => {

    return (
        <MaintenanceMessage
            isMaintenance={isMaintenance}
            content="Start with IDRX today. More stable coins are on the way!"
            title="Expanding Soon"
        >
            <button
                type="button"
                onClick={onClick}
                className={clsx(
                    "cursor-pointer flex items-center gap-2.5 px-3 w-full bg-[#F4F7F6] rounded-[12px] border border-[#E6ECEA] transition-colors hover:border-[#C2CFCB] h-[64px]",
                )}
                disabled={isMaintenance}
            >
                <TokenIcon src={icon} alt={title} size="md" />

                <div className="inline-flex flex-col items-start justify-center">
                    <div className="inline-flex items-center gap-1.5">
                        <p className="font-semibold text-[#003E2C] text-lg max-w-[90px] truncate">{title}</p>

                        <ChevronDownIcon className="w-4 h-4 text-[#003E2C]" />
                    </div>

                    <div className="text-xs capitalize text-[#6A9080]">
                        {isFrom ? "" : "on "}
                        {subtitle}
                    </div>
                </div>
            </button>
        </MaintenanceMessage>
    );
};

export default AssetSelector;
