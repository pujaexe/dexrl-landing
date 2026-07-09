"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open?: boolean;
  onCancel?: () => void;
  footer?: ReactNode;
  centered?: boolean;
  width?: number;
  closable?: boolean;
  closeIcon?: ReactNode;
  className?: string;
  styles?: { content?: CSSProperties; body?: CSSProperties };
  children?: ReactNode;
}

/** Tailwind drop-in for the antd <Modal> subset used by the widget. */
export function Modal({
  open,
  onCancel,
  footer,
  width = 416,
  closable = true,
  closeIcon,
  className,
  styles,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#001B0E]/60" onClick={onCancel} />
      <div
        className={`relative bg-white rounded-2xl border border-[#C2CFCB] shadow-[0_20px_60px_-12px_rgba(0,20,10,0.45)] w-full ${className ?? ""}`}
        style={{ maxWidth: width, ...styles?.content }}
      >
        {closable && (
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 z-10 text-[#6A9080] hover:text-[#003E2C] cursor-pointer"
            aria-label="Close"
          >
            {closeIcon ?? <X className="w-5 h-5" />}
          </button>
        )}
        <div style={{ padding: 24, ...styles?.body }}>{children}</div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
