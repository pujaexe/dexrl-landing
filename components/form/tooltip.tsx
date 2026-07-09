import React from "react";
import clsx from "clsx";
import { Icon } from "../icon/Icon";
import { Iconify } from "../icon/Iconify";

interface TooltipProps {
  title: string;
  content: React.ReactNode;
  theme?: string;
  icon?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  content,
  theme = "light",
  icon,
}) => {
  return (
    <div className="relative group inline-block text-left ml-2">
      <div className="relative">
        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
          <Icon className="text-white text-[10px] font-bold" name="question" />
        </div>
        <div
          className={clsx(
            "absolute z-10 hidden group-hover:block w-78 border rounded-xl shadow-lg p-4 text-sm bottom-full left-1/2 transform -translate-x-1/2 mb-2",
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-gray-700 border-gray-200"
          )}
        >
          <span
            className={clsx(
              "text-lg font-semibold flex items-center gap-2 mb-2",
              theme === "dark" ? "text-blue-200" : "text-blue-700"
            )}
          >
            {icon && <Iconify name={icon} className="text-lg" />}
            {title}
          </span>
          {content}
        </div>
      </div>
    </div>
  );
};
