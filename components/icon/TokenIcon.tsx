import clsx from "clsx";
import { useEffect, useState } from "react";

interface TokenIconProps {
    src?: string;
    alt?: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    fallbackClassName?: string;
    disabled?: boolean;
}

const sizeClasses = {
    xs: "w-9 h-9 min-w-9 min-h-9 text-xs",
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
};

const TokenIcon = ({
    src,
    alt = "",
    size = "md",
    className,
    fallbackClassName,
    disabled = false,
}: TokenIconProps) => {
    const [imageError, setImageError] = useState(false);

    // Reset the error state when the token (src) changes, otherwise the fallback
    // letter sticks even after switching to a token with a valid logo.
    useEffect(() => {
        setImageError(false);
    }, [src]);

    if (!imageError && src) {
        return (
            <img
                src={src}
                alt={alt}
                className={clsx(
                    "rounded-full object-contain",
                    sizeClasses[size],
                    disabled && "grayscale",
                    className
                )}
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div
            className={clsx(
                "rounded-full flex items-center justify-center font-semibold bg-slate-300 text-slate-700",
                sizeClasses[size],
                disabled && "opacity-50",
                fallbackClassName
            )}
        >
            {alt?.charAt(0)?.toUpperCase() || "?"}
        </div>
    );
};

export default TokenIcon;
