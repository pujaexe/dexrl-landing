"use client";

import MaintenanceMessage from "@/components/MaintenanceMessage";
import clsx from "clsx";
import { ArrowLeftRightIcon } from "lucide-react";
import { useState, type FC } from "react";

interface SwapButtonProps {
    onClick: () => void;
    isMaintenance?: boolean;
}

const SwapButton: FC<SwapButtonProps> = ({ onClick, isMaintenance }) => {
    const [isSpinning, setIsSpinning] = useState(false);

    const handleClick = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        onClick?.();

        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    };

    return (
        <>
            <style>
                {`
                    .spin-once {
                        animation: spin-once 0.2s linear;
                    }
                    @keyframes spin-once {
                        100% { transform: rotate(180deg); }
                    }
                `}
            </style>
            <MaintenanceMessage
                isMaintenance={isMaintenance}
                content="We’re improving this feature. It will be back shortly."
                title="Under Maintenance"
            >
                <button
                    type="button"
                    className={clsx(
                        "w-10 h-10 rounded-full bg-[#ECF0EF] border border-[#E6ECEA] flex items-center justify-center cursor-pointer shrink-0",
                        "hover:bg-[#D8E3DF] transition-colors"
                    )}
                    onClick={handleClick}
                    disabled={isMaintenance}
                >
                    <ArrowLeftRightIcon
                        className={clsx(
                            "w-4 h-4 text-[#003E2C] transition-transform",
                            isSpinning && "spin-once"
                        )}
                    />
                </button>
            </MaintenanceMessage>
        </>
    );
};

export default SwapButton;
