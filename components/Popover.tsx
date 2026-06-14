"use client";

import type { ReactNode } from "react";
import { HoverPopover } from "./ui/Popover";

interface PopoverProps extends React.PropsWithChildren {
    content?: ReactNode;
    title?: ReactNode;
    disabled?: boolean;
}

const Popover = ({ children, content, title, disabled = false }: PopoverProps) => {
    if (disabled) {
        return children;
    }
    return (
        <HoverPopover
            content={typeof content === "string" ? <p className="text-sm max-w-64 text-white">{content}</p> : content}
            title={typeof title === "string" ? <span className="font-semibold text-white">{title}</span> : title}
        >
            {children}
        </HoverPopover>
    );
};

export default Popover;
