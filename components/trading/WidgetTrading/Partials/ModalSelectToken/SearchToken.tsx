"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { Iconify } from "@/components/icon/Iconify";

interface SearchTokenProps {
    defaultValue: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchToken = forwardRef<HTMLInputElement, SearchTokenProps>(
    ({ defaultValue, handleSearch }, ref) => {
        return (
            <div className="px-4">
                <div
                    className={clsx(
                        "flex items-center gap-2 rounded-[12px] px-3 py-2 transition-colors border h-[45px]",
                        "bg-white border-[#C2CFCB] text-[#003E2C] placeholder-slate-400"
                    )}
                >
                    <input
                        type="text"
                        placeholder="Search tokens..."
                        defaultValue={defaultValue}
                        onChange={handleSearch}
                        ref={ref}
                        className={clsx(
                            "w-full bg-transparent outline-none text-sm",
                            "text-[#003E2C] placeholder-slate-400"
                        )}
                    />
                    {ref && typeof ref !== "function" && ref.current && ref.current.value ? (
                        <button
                            className={clsx(
                                "ml-2 p-1 rounded-full transition-colors focus:outline-none cursor-pointer",
                                "hover:bg-[#ECF0EF]"
                            )}
                            type="button"
                            onClick={() => {
                                if (ref && typeof ref !== "function" && ref.current) {
                                    ref.current.value = "";
                                    const event = new Event('input', { bubbles: true });
                                    ref.current.dispatchEvent(event);
                                    handleSearch({ target: ref.current, nativeEvent: new Event('input'), currentTarget: ref.current, bubbles: true } as React.ChangeEvent<HTMLInputElement>);
                                }
                            }}
                            tabIndex={-1}
                        >
                            <Iconify name="material-symbols:close-rounded" className={clsx("text-base", "text-[#2D5C47]")} />
                        </button>
                    ) : (
                        <Iconify
                            name="mingcute:search-2-line"
                            className={clsx(
                                "text-lg",
                                "text-[#6A9080]"
                            )}
                        />
                    )}
                </div>
            </div>
        );
    }
);

SearchToken.displayName = "SearchToken";

export default SearchToken;