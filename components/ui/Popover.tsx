"use client";

import type { ReactNode } from "react";

interface HoverPopoverProps {
  content?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
}

/** CSS hover popover — dark rounded card, Tailwind drop-in for the antd <Popover> usage. */
export function HoverPopover({ content, title, children }: HoverPopoverProps) {
  return (
    <span className="relative inline-flex group/pop">
      {children}
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 max-w-[80vw] rounded-[20px] bg-black p-3 text-white opacity-0 shadow-[0_0_10px_0_rgba(0,0,0,0.5)] transition-opacity duration-150 group-hover/pop:opacity-100 z-[2000]">
        {title ? <div className="font-semibold mb-1">{title}</div> : null}
        {content ? <div className="text-sm">{content}</div> : null}
      </span>
    </span>
  );
}

export default HoverPopover;
