"use client";

import clsx from "clsx";
import type { ChainInterface } from "@/data";

interface ChainButtonProps {
    chain: ChainInterface;
    isSelected: boolean;
    handleSelectedChain: (chain: ChainInterface) => void;
}

const ChainButton: React.FC<ChainButtonProps> = ({ chain, isSelected, handleSelectedChain }) => (
    <div
        key={chain.id}
        className={clsx(
            "flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer flex-shrink-0",
            isSelected
                ? "bg-[#E4F1C2] ring-2 ring-[#CBF23D]"
                : "bg-[#ECF0EF] ring-1 ring-[#D8E3DF] hover:ring-[#C2CFCB]"
        )}
        onClick={() => {
            handleSelectedChain(chain);
        }}
    >
        {chain.logoURI ? (
            <img
                src={chain.logoURI}
                alt={chain.name}
                className="w-9 h-9 object-contain rounded-full"
            />
        ) : (
            <div
                className="w-9 h-9 rounded-full"
                style={{ backgroundColor: chain?.color }}
            />
        )}
    </div>
);

interface ChainsProps {
    chains: ChainInterface[];
    selectedChain?: ChainInterface | null;
    handleSelectedChain: (chain: ChainInterface) => void;
}
const Chains: React.FC<ChainsProps> = ({ chains, selectedChain, handleSelectedChain }) => {
    return (
        <div className="flex gap-4 py-1 px-4 overflow-x-auto scrollbar-primary">
            {chains.map((chain) => (
                <ChainButton
                    key={chain.id}
                    chain={chain}
                    isSelected={selectedChain?.id === chain.id}
                    handleSelectedChain={handleSelectedChain}
                />
            ))}
        </div>
    );
};

export default Chains;