"use client";

import type { ReactNode } from "react";

interface TooltipProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** CSS hover tooltip — Tailwind drop-in for the antd <Tooltip> subset used by the widget. */
export function Tooltip({ title, children, className }: TooltipProps) {
  if (!title) return <>{children}</>;
  return (
    <span className={`relative inline-flex group/tt ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-[#003E2C] px-2.5 py-1.5 text-xs font-medium text-[#ECF0EF] opacity-0 shadow-lg transition-opacity duration-150 group-hover/tt:opacity-100 z-[2000]"
      >
        {title}
      </span>
    </span>
  );
}

export default Tooltip;
