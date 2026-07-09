"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, Search } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  options?: Option[];
  placeholder?: string;
  loading?: boolean;
  showSearch?: boolean;
  status?: "error";
  disabled?: boolean;
  className?: string;
}

/** Searchable dropdown — Tailwind drop-in for the antd <Select> usage. */
export function Select({
  value,
  onChange,
  onBlur,
  options = [],
  placeholder,
  loading,
  showSearch,
  status,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onBlur]);

  const selected = options.find((o) => o.value === value);
  const filtered =
    showSearch && query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

  return (
    <div ref={ref} className={clsx("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "w-full h-[54px] px-3 rounded-[12px] bg-[#F4F7F6] border border-[#E6ECEA] flex items-center justify-between text-base font-medium transition-shadow",
          status === "error" ? "ring-1 ring-red-500" : "focus:ring-1 focus:ring-[#003E2C]",
          "outline-none",
        )}
      >
        <span className={selected ? "text-[#003E2C]" : "text-[#6A9080]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-5 w-5 text-[#6A9080] shrink-0" />
      </button>

      {open && (
        <div className="absolute z-[60] mt-1 w-full rounded-lg bg-[#ECF0EF] border border-[#D8E3DF] shadow-lg max-h-60 overflow-auto">
          {showSearch && (
            <div className="p-2 sticky top-0 bg-[#ECF0EF]">
              <div className="flex items-center gap-2 bg-white rounded-md px-2 h-9">
                <Search className="w-4 h-4 text-[#6A9080] shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent outline-none text-sm text-[#003E2C] placeholder-[#6A9080]"
                />
              </div>
            </div>
          )}
          {loading ? (
            <div className="p-3 text-sm text-[#6A9080]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-sm text-[#6A9080]">No options</div>
          ) : (
            filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange?.(o.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={clsx(
                  "w-full text-left px-3 py-2 text-base text-[#003E2C] hover:bg-[#E4F1C2]",
                  o.value === value && "bg-[#E4F1C2]",
                )}
              >
                {o.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Select;
