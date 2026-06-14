"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  message?: ReactNode;
  description?: ReactNode;
  duration?: number; // seconds; 0 = sticky
  placement?: string; // accepted for antd compatibility, ignored
}

interface Toast extends ToastOptions {
  id: number;
  type: ToastType;
}

// Minimal module-level toast store (drop-in for antd `notification`).
let toasts: Toast[] = [];
let listeners: Array<() => void> = [];
let counter = 0;

function emit() {
  listeners.forEach((l) => l());
}

function remove(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function add(type: ToastType, opts: ToastOptions) {
  const id = ++counter;
  toasts = [...toasts, { id, type, ...opts }];
  emit();
  const ms = (opts.duration ?? 4) * 1000;
  if (ms > 0) setTimeout(() => remove(id), ms);
}

const api = {
  success: (o: ToastOptions) => add("success", o),
  error: (o: ToastOptions) => add("error", o),
  info: (o: ToastOptions) => add("info", o),
  warning: (o: ToastOptions) => add("warning", o),
};

export const notification = {
  ...api,
  // antd-compatible hook: returns [api, contextHolder]. The toasts render via the
  // global <Toaster/> (mounted in WidgetProviders), so contextHolder is null.
  useNotification: () => {
    const memo = useMemo(() => api, []);
    return [memo, null] as const;
  },
};

const ICONS = { success: CheckCircle, error: XCircle, info: Info, warning: AlertCircle };
const COLORS = { success: "#2BB673", error: "#E5484D", info: "#003E2C", warning: "#F5A623" };

export function Toaster() {
  const [, force] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const l = () => force((n) => n + 1);
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[2000] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-32px)]">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className="bg-white border border-[#C2CFCB] rounded-xl shadow-[0_8px_28px_-8px_rgba(0,20,10,0.25)] p-3 flex gap-3 items-start animate-[fadeUp_0.2s_ease]"
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: COLORS[t.type] }} />
            <div className="flex-1 min-w-0">
              {t.message && (
                <div className="font-semibold text-[#003E2C] text-sm break-words">{t.message}</div>
              )}
              {t.description && (
                <div className="text-[#6A9080] text-xs mt-0.5 break-words">{t.description}</div>
              )}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-[#6A9080] hover:text-[#003E2C] shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
