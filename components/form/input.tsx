import clsx from "clsx";
import React from "react";
import { Iconify } from "../icon/Iconify";

type InputProps = {
  className?: string;
  inputClassName?: string;
  labelName?: React.ReactNode;
  type: "email" | "text";
  hasLabel?: boolean;
  hasPrefixEl?: boolean;
  hasPrefixIcon?: boolean;
  hasCustomPrefix?: boolean;
  customPrefix?: string;
  prefixPosition?: "left" | "right";
  icon?: string;
  placeholder?: string;
  variant?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

export const Input = ({
  className,
  inputClassName,
  labelName,
  type,
  hasLabel = false,
  hasPrefixEl,
  hasPrefixIcon,
  prefixPosition = "left",
  hasCustomPrefix,
  customPrefix,
  icon,
  placeholder,
  variant = "normal",
  value,
  onChange,
  onKeyDown,
  disabled = false,
  readOnly = false,
}: InputProps) => (
  <div className={className}>
    <label
      className={clsx(
        "block text-sm mb-1",
        variant !== "light" && "text-slate-400"
      )}
    >
      {hasLabel && labelName}
    </label>
    <div
      className={clsx(
        "flex items-center rounded-lg",
        !disabled && "focus-within:ring-1 focus-within:ring-blue-500",
        variant === "light"
          ? "p-3 border border-slate-200 shadow-sm"
          : "bg-slate-700 p-3",
        disabled && "opacity-50 cursor-not-allowed",
        inputClassName
      )}
    >
      {hasPrefixEl && (
        <span className={clsx("mr-2", variant !== "light" && "text-slate-400")}>
          Rp
        </span>
      )}
      {hasPrefixIcon && icon && (
        <Iconify
          name={icon}
          className={clsx(
            "text-xl mr-2",
            variant !== "light" && "text-slate-400"
          )}
        />
      )}
      {hasCustomPrefix && prefixPosition === "left" && (
        <span className={clsx("mr-2", variant !== "light" && "text-slate-400")}>
          {customPrefix}
        </span>
      )}
      <input
        type={type}
        className={clsx(
          "bg-transparent border-none flex-1 focus:outline-none placeholder-slate-500",
          disabled && "cursor-not-allowed",
          prefixPosition === "right" && "text-right",
          variant !== "light" && "text-white placeholder-slate-500"
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-disabled={disabled}
        readOnly={readOnly}
      />

      {hasCustomPrefix && prefixPosition === "right" && (
        <span className={clsx("ml-2", variant !== "light" && "text-slate-400")}>
          {customPrefix}
        </span>
      )}
    </div>
  </div>
);
