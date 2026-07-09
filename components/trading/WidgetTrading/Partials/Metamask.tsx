"use client";

import { Iconify } from "@/components/icon/Iconify";
import type { FC } from "react";

interface MetamaskProps {
    onClose?: () => void;
}
const Metamask: FC<MetamaskProps> = ({ onClose }) => {
    return (
        <div className="flex items-center gap-2 rounded-lg bg-white py-1 px-2">
            <span className="text-sm text-[#003E2C] capitalize">Metamask</span>
            <span
                onClick={() => {
                    onClose?.();
                }}
                className="cursor-pointer flex items-center justify-center rounded-full bg-[#CBF23D] hover:bg-[#CBF23D]/80 p-0.5"
            >
                <Iconify name="material-symbols:check" className="text-[#003E2C] text-xs" />
            </span>
        </div>
    );
};

export default Metamask;
