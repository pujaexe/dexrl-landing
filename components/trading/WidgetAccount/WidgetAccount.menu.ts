"use client";

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onClick?: () => void;
  link?: string;
  type?: "button" | "link";
  isNeedLogin?: boolean;
  isMaintenance?: boolean;
}

export const accountMenuItems: MenuItem[] = [
  {
    id: "buy-crypto",
    label: "Swap Crypto",
    icon: "ci:arrow-left-right",
    type: "button",
    isNeedLogin: false,
  },
  {
    id: "transaction-history",
    label: "Transaction History",
    icon: "material-symbols:history",
    type: "button",
    isNeedLogin: true,
  },
  {
    id: "receiving-account",
    label: "Receiving Account",
    icon: "solar:wallet-outline",
    type: "button",
    isNeedLogin: true,
  },
  {
    id: "help",
    label: "Help",
    icon: "solar:question-circle-outline",
    type: "button",
    isNeedLogin: false,
  },
];
