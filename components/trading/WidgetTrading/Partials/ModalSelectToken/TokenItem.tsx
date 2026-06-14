"use client";

import clsx from "clsx";
import { Iconify } from "@/components/icon/Iconify";
import TokenIcon from "@/components/icon/TokenIcon";
import type { TokenInterface } from "@/data";

interface TokenItemProps {
    token: TokenInterface;
    isDark: boolean;
    handleOnSelect: (token: TokenInterface) => void;
    isSelected: boolean;
}
const TokenItem: React.FC<TokenItemProps> = ({ token, isDark, handleOnSelect, isSelected }) => {
    const isDisabled = !token.isActive;

    const hoverBg = isDark ? "hover:bg-[#ECF0EF]" : "hover:bg-slate-50";
    const secondaryText = isDark ? "text-[#6A9080]" : "text-[#6A9080]";

    const handleRedirectToken = (token: TokenInterface) => {
        const address = token.address;
        const chainUrl = token?.chain?.metamask.blockExplorerUrls[0] || "";
        const url = chainUrl + `address/${address}`;

        const anchor = document.createElement("a");
        Object.assign(anchor, {
            target: "_blank",
            rel: "noopener noreferrer",
            href: url,
        });
        anchor.click();
    };


    return (
        <div
            key={`${token.chainId}-${token.address}`}
            className={clsx(
                "group flex justify-between items-center py-2 px-4 transition-all duration-200 ease-in-out border-b border-slate-100",
                isDisabled
                    ? "opacity-50 cursor-not-allowed bg-gray-100 text-[#6A9080] pointer-events-none"
                    : [
                        "cursor-pointer",
                        hoverBg,
                        isSelected &&
                        (isDark ? "bg-[#ECF0EF]" : "bg-slate-200"),
                    ],
                isDark && "border-[#C2CFCB]"
            )}
            onClick={!isDisabled ? () => handleOnSelect(token) : undefined}
        >
            {/* LEFT */}
            <div className="flex items-center">
                <TokenIcon
                    src={token.logoURI}
                    alt={token.symbol}
                    size="xs"
                    className="mr-3"
                    fallbackClassName={clsx(
                        "mr-3",
                        isDark ? "bg-[#ECF0EF] text-[#003E2C]" : "bg-slate-300 text-[#2D5C47]"
                    )}
                    disabled={isDisabled}
                />
                <div>
                    <div className="font-medium">
                        {token.symbol}{" "}
                        <span className={clsx("text-xs", secondaryText)}>
                            {token.name}
                        </span>
                    </div>
                    <div
                        className="text-xs capitalize font-medium bg-clip-text text-transparent"
                        style={{
                            backgroundImage: token?.chain?.color,
                            color: token?.chain?.color,
                        }}
                    >
                        on {token?.chain?.name}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            {!isDisabled && (
                <div
                    className={clsx(
                        "flex items-center gap-2 text-xs font-mono transition-all duration-200 ease-in-out",
                        "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 cursor-pointer",
                        secondaryText
                    )}
                    onClick={() => handleRedirectToken(token)}
                >
                    <TextWithCenterEllipsis
                        text={token?.address || ""}
                        maxLength={15}
                        className={clsx("text-xs", secondaryText)}
                    />
                    <button
                        className={clsx(
                            "p-1 rounded transition-colors",
                            isDark ? "hover:bg-[#ECF0EF]" : "hover:bg-gray-200"
                        )}
                    >
                        <Iconify
                            name="ion:arrow-up-right-box-outline"
                            className="text-xs"
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TokenItem;

interface TextWithCenterEllipsisProps {
    text: string;
    maxLength?: number;
    className?: string;
}

const TextWithCenterEllipsis: React.FC<TextWithCenterEllipsisProps> = ({
    text,
    maxLength = 30,
    className = "",
}) => {
    const formatText = (str: string, max: number): string => {
        if (str.length <= max) return str;

        const start = Math.floor((max - 3) / 2);
        const end = Math.ceil((max - 3) / 2);

        return `${str.slice(0, start)}......${str.slice(-end)}`;
    };

    return (
        <span className={`${className}`} title={text}>
            {formatText(text, maxLength)}
        </span>
    );
};
