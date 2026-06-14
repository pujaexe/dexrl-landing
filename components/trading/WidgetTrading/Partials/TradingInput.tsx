"use client";

import clsx from "clsx";
import { forwardRef, type ReactNode } from "react";

interface TradingInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "suffix"
> {
    label: string;
    labelSuffix?: ReactNode;
    prefix?: ReactNode;
    suffix?: ReactNode;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const TradingInput = forwardRef<HTMLInputElement, TradingInputProps>(
    ({ label, labelSuffix, prefix, suffix, containerProps, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6A9080]">{label}</label>
                    {labelSuffix}
                </div>

                <div
                    {...containerProps}
                    className={clsx(
                        "relative flex items-center gap-2 bg-[#F4F7F6] rounded-[12px] border border-[#E6ECEA] w-full",
                        containerProps?.className
                    )}
                >
                    {prefix && (
                        <div className="flex items-center absolute left-3">{prefix}</div>
                    )}

                    <input
                        ref={ref}
                        type="text"
                        {...props}
                        className={clsx(
                            "h-[60px] px-3 flex-1 border-0 font-medium text-[#003E2C] placeholder-[#6A9080] text-lg outline-none",
                            "rounded-[12px] focus:ring-1 focus:ring-[#003E2C] focus:border-0 bg-transparent",
                            prefix && "pl-16",
                            suffix && "pr-16",
                            props.className
                        )}
                    />

                    {suffix && (
                        <div className="flex items-center gap-2 absolute right-2.5">
                            {suffix}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

TradingInput.displayName = "TradingInput";

export default TradingInput;
