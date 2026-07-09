import clsx from "clsx";
import React from "react";
import { getInitials, toCamelCase } from "../../../helper";
import { Input } from "../input";
import type { WalletDestinationInterface } from "../../../data";

type RadioProps = {
  label: string;
  className?: string;
  radioClass?: string;
  description?: string;
  bgColor?: string;
  onCheck?: (val: WalletDestinationInterface) => void;
  onInput?: (val: WalletDestinationInterface) => void;
  hasInput?: boolean;
  value?: string;
  address?: string;
  checked?: boolean;
  walletData: WalletDestinationInterface;
};

export const Radio = ({
  label,
  className,
  radioClass,
  description,
  bgColor,
  onCheck,
  onInput,
  hasInput,
  value,
  address,
  checked,
  walletData,
}: RadioProps) => {
  const handleChecked = () => {
    onCheck?.({
      label,
      value,
      address,
    });
  };

  const handleInputErc20 = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInput?.({
      label,
      value,
      address: e.target.value,
    });
  };

  return (
    <div className="space-y-3">
      <div className={clsx("bg-slate-700 rounded-lg p-3", className)}>
        <div className="flex items-center">
          <input
            type="radio"
            id={toCamelCase(label)}
            name="walletOption"
            className={clsx("mr-3 accent-blue-500", radioClass)}
            onChange={handleChecked}
            checked={checked}
          />
          <div className="flex items-center">
            <div
              className={clsx(
                "w-6 h-6 rounded-full flex items-center justify-center mr-2",
                bgColor ? bgColor : "bg-blue-600"
              )}
            >
              <span className="text-xs font-bold text-white">
                {getInitials(label, 1)}
              </span>
            </div>
            <label className="text-white cursor-pointer">{label}</label>
          </div>
        </div>
        <div className="mt-1 text-slate-400 text-xs pl-6">{description}</div>
        {hasInput && walletData?.value === "erc20" && (
          <div id="manualInputField" className="mt-2 pl-6">
            <Input
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your ERC20 wallet address"
              variant="dark"
              value={walletData?.address || address}
              onChange={handleInputErc20}
            />
          </div>
        )}
      </div>
    </div>
  );
};
