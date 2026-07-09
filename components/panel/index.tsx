import clsx from "clsx";
import React from "react";

type PanelProps = {
  className?: string;
  type: "info" | "warning" | "alert" | "success";
  withClose?: boolean;
  children: React.ReactNode;
};

export const Panel = ({ className, type, children }: PanelProps) => {
  const variantClass = {
    info: "bg-blue-600/20 text-blue-300 border border-blue-600",
    warning: "",
    alert: "",
    success: "",
  };

  return (
    <div id="panel" className={clsx(className, variantClass[type])}>
      {children}
    </div>
  );
};
