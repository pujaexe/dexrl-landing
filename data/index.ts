import { Home, Users, Settings, BoxIcon, Wallet } from "lucide-react";
import { AllowedAffiliate, AllowedAllMember, AllowedManagement } from "./roles";
export interface ChainInterface {
  id: number;
  logoURI?: string;
  key: string;
  name: string;
  metamask: {
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
  nativeToken?: {
    address: string;
  };
  color: string;
  tokenCount?: number;
}

export interface TokenInterface {
  symbol?: string;
  name: string;
  coinKey?: string;
  logoURI?: string;
  network?: string;
  address?: string;
  chainId?: number;
  priceUSD?: number | string;
  decimals?: number;
  coingeckoId?: string;
  isActive?: string;
  chain?: ChainInterface;
}

export interface BankListInterface {
  name: string;
  bankFee?: number;
  color?: string;
  method?: string;
  type?: string;
}
export interface DBBankTransferInterface {
  bank_name: string;
  bank_code: string;
  max_amount_transfer: number;
  logo_url?: string;
}
export interface BankTransferInterface {
  id?: number;
  bankName: string;
  bankCode: string;
  maxAmountTransfer: number;
  logoUrl?: string;
}
export interface BankAccountInterface {
  id?: number;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  bankName: string;
  maxAmountTransfer: number;
  logoUrl?: string;
}

export interface WalletDestinationInterface {
  label: string;
  color?: string;
  description?: string;
  value?: string;
  hasInput?: boolean;
  address?: string;
}

export interface BodyQuoteInterface {
  toAddress?: string;
  amount?: number;
  transactionId?: string;
  quoteParams: {
    fromChain?: number;
    fromToken?: string;
    toChain?: number;
    toToken?: string;
  };
}

export interface LiFiQuote {
  id: string;
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  gasCost: string;
  estimatedDuration: number;
}

export interface LiFiRoute {
  id: string;
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  steps: any[];
}
export interface TransactionStatus {
  id: string;
  type: "mint" | "bridge" | "transfer";
  status: "pending" | "success" | "failed";
  fromAmount: string;
  toAmount: string;
  fromChain: number;
  toChain: number;
  timestamp: number;
  hash?: string;
  error?: string;
}

export interface SettingInterface {
  id: string;
  value: string;
  oxo_address: string;
}

export const BANK_LIST: BankListInterface[] = [
  {
    name: "Bank Transfer",
    bankFee: 5000,
    color: "bg-blue-600",
    method: "transfer",
    type: "number",
  },
  {
    name: "E-Wallet",
    bankFee: 1.67,
    color: "bg-blue-600",
    method: "e-wallet",
    type: "percentage",
  },
  {
    name: "QRIS",
    bankFee: 0,
    color: "bg-blue-600",
    method: "qris",
    type: "number",
  },
];

export const WALLET_DESTINATION: WalletDestinationInterface[] = [
  {
    label: "OXO Wallet",
    color: "bg-blue-600",
    description: "We'll create a wallet for you if you don't have it",
    value: "oxo",
  },
];

export const MENUS = [
  {
    label: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: AllowedAllMember,
  },
  {
    label: "My Page",
    url: "/my-page",
    icon: Users,
    roles: AllowedAffiliate,
  },
  {
    label: "Affiliate",
    url: "/affiliate",
    icon: Users,
    roles: AllowedManagement,
  },
  {
    label: "Business",
    url: "/business",
    icon: Users,
    roles: AllowedManagement,
  },
  {
    label: "Transaction",
    url: "/transaction",
    icon: BoxIcon,
    roles: AllowedAllMember,
  },
  {
    label: "Withdrawal",
    url: "/withdrawal",
    icon: Wallet,
    roles: AllowedManagement,
  },
  {
    label: "Settings",
    url: "/settings",
    icon: Settings,
    roles: AllowedAllMember,
  },
];
