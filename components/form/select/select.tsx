// file: Select.tsx

import React from "react";
import { Icon } from "../../icon/Icon";
import clsx from "clsx";
import { Tooltip } from "../tooltip";

type SelectProps = {
  label?: string;
  className?: string;
  selectClassName?: string;
  children?: React.ReactNode;
  onOpen: (val: boolean) => void;
  openSelect: boolean;
  placeholder?: React.ReactNode;
  position: "absolute-top" | "relative-bottom";
  hasAdditionalButton?: boolean;
  variant?: string;
  hasTooltip?: boolean;
  tooltipIcon?: string;
  tooltipLabel?: string;
  tooltipContent?: React.ReactNode;
  hasNotes?: boolean;
  notes?: string;
  onOpenAdditionalButton?: () => void;
  disabled?: boolean;
  customLabelPrefix?: React.ReactNode; // ✅ Tambahan baru
};

export const Select = ({
  className,
  selectClassName,
  children,
  onOpen,
  label,
  placeholder,
  position,
  hasAdditionalButton,
  variant,
  hasTooltip,
  tooltipLabel,
  tooltipIcon,
  tooltipContent,
  hasNotes,
  notes,
  onOpenAdditionalButton,
  disabled = false,
  customLabelPrefix, // ✅ Prop baru
}: SelectProps) => {
  const handleClick = () => {
    if (disabled) return;
    onOpen(true);
  };

  const handleClickButton = () => {
    if (disabled) return;
    onOpenAdditionalButton?.();
  };

  return (
    <div className={className}>
      <div
        className={clsx(
          hasAdditionalButton && "flex justify-between",
          "mt-4 mb-1"
        )}
      >
        <label
          className={clsx(
            "block text-sm mb-1 flex items-center gap-1",
            variant !== "light" && "text-slate-400"
          )}
        >
          {customLabelPrefix && <span>{customLabelPrefix}</span>}
          {label}
          {hasTooltip && tooltipLabel && (
            <Tooltip
              title={tooltipLabel}
              theme={variant}
              icon={tooltipIcon}
              content={tooltipContent}
            />
          )}
        </label>

        {hasAdditionalButton && (
          <button
            className={clsx(
              "text-xs text-blue-400",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={handleClickButton}
            disabled={disabled}
          >
            + Add New
          </button>
        )}
      </div>

      <div
        onClick={handleClick}
        className={clsx(
          "rounded-lg p-3 flex items-center justify-between",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          variant === "light"
            ? "bg-white border border-slate-200 shadow-sm"
            : "bg-slate-700",
          hasNotes && "border !border-red-600",
          selectClassName
        )}
        aria-disabled={disabled}
      >
        {placeholder || label}
        <Icon name="chevron-down" className="text-slate-500" />
      </div>

      <div className={position === "relative-bottom" ? "relative" : ""}>
        <div
          id="tokenModal"
          className="token-modal absolute top-0 left-0 right-0 bg-slate-900 z-20"
        >
          {children}
        </div>
      </div>

      {hasNotes && <div className="text-xs text-red-600">{notes}</div>}
    </div>
  );
};
