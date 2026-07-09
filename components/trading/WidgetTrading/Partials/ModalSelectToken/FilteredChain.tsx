"use client";

import clsx from "clsx";
import type { ChainInterface } from "@/data";
import { formatNumber } from "@/helper";

interface FilteredChainProps {
    filteredChains: ChainInterface[];
    onSelectChain: (chain: ChainInterface) => void;
}

const FilteredChain = ({ filteredChains, onSelectChain }: FilteredChainProps) => {  
    const secondaryText = "text-[#6A9080]";

    return (
        <div className={clsx("flex flex-col sticky top-0 z-10", "bg-white")}>
            <span className={clsx("font-medium text-sm px-4 bg-slate-50 text-[#2D5C47] py-2 mb-1", "bg-[#ECF0EF] text-[#003E2C]")}>
                Chains
            </span>
            <div className="flex flex-col gap-2 px-4 py-3">
                {filteredChains?.map((chain) => (
                    <div
                        key={chain.id}
                        className={clsx(
                            "flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors",
                            "bg-[linear-gradient(90deg,#334155_0%,#475569_100%)]"
                        )}
                        onClick={() => onSelectChain(chain)}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={chain.logoURI}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-semibold">{chain.name}</div>
                                <div className={clsx("text-xs", secondaryText)}>
                                    {formatNumber(chain.tokenCount || 0)} assets
                                </div>
                            </div>
                        </div>
                        <div className="px-3 py-1 text-[#003E2C] font-medium rounded-lg hover:bg-[#003E2C]/10">
                            view assets
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilteredChain;