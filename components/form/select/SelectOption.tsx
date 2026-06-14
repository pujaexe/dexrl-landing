import React from "react";

type SelectOptionsProps = {
  className?: string;
  children: React.ReactNode;
  onSelect?: (val: string) => void;
  value?: string;
};

export const SelectOption = ({
  className,
  children,
  onSelect,
  value,
}: SelectOptionsProps) => {
  const handleSelectOpt = () => {
    onSelect?.(value ?? "");
  };

  return (
    <div className={className} onClick={handleSelectOpt}>
      {children}
    </div>
  );
};
