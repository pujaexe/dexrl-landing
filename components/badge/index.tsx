import clsx from "clsx";
import * as React from "react";

const badgeClass = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement> { }

function Badge({ className, ...props }: BadgeProps) {
    return (
        <div className={clsx(badgeClass, className)} {...props} />
    );
}

export default Badge;
