import type { BankListInterface, TokenInterface } from ".";

export interface FormData {
  step1: {
    amount: number;
    token: TokenInterface;
    payment: BankListInterface;
    received: number;
    usdtRate: number;
    inputDisplay?: string;
    logoURI?: string;
    processingFee?: number;
  };
  step2: {
    createdAt: string;
    quote: {
      toAddress: string;
      amount: number;
      transactionId: string;
      quoteParams: {
        fromChain: number;
        fromToken: string;
        toChain: number;
        toToken: string;
      };
    };
  };
}

export interface Token {
  id: string;
  token_name: string;
  token_symbol: string;
  updated_at: string;
}

export interface SaveLoginSession {
  provider: string;
  user?: {
    email?: string;
    name?: string;
    avatar_url?: string;
    userId?: string;
  };
  address?: string;
}

export interface SetupAffilateAccount {
  email: string;
  username: string | null;
  password: string | null;
  confirm_password: string | null;
  first_name?: string;
  last_name?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  swcAddress: string | null;
  chainId: number | null;
  smartAccount: any | null;
  error?: string | null;
  addressRecord: any | null;
  /** EOA address (second wallet, e.g. for swap to BTC) */
  eoaAddress: string | null;
  /** EOA address record from backend */
  eoaRecord: any | null;
  /** For Google flow: EOA account for signing (optional) */
  eoaAccount?: any | null;
}

export interface User {
  sub?: string;
  fullname?: string;
  is_google?: boolean;
  avatar_url?: string;
  email?: string;
  swc_seed?: number;
  is_active?: boolean;
  login_count?: number;
}

export interface Affiliate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  is_management: boolean;
  sales?: number;
  commission?: number;
  crypto_settings?: CryptoSettings;
}

export interface CryptoSettings {
  chain: Array<{ value: number; label: string }>;
  token: Array<{
    value: string;
    label: string;
    token_symbol?: string;
    token_address?: string;
    chain_id?: number;
  }>;
}

export interface BaseParams {
  page?: number;
  pageSize?: number;
  search?: string;
  limit?: number;
  status?: string;
  type?: string;
  chain?: string;
  startDate?: string;
  endDate?: string;
  filter?: string;
}

export interface Metadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  limit?: number;
  total_data?: number;
  total_pages?: number;
  has_next_page?: boolean;
  has_prev_page?: boolean;
}

export interface B2BMetadata {
  page: number;
  limit: number;
  total_data: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface AffiliateUserInterface {
  theme?: "dark" | "light";
  title: string;
  subtitle?: string;
  content: string;
  background: string;
  color: string;
  buttons: {
    title: string;
    link: string;
    color: string;
  }[];
  affiliate?: Affiliate;
  crypto_settings?: CryptoSettings;
}

export interface CreateTransactionInterface {
  addressId: string;
  amount: number;
  transactionId: string;
  toAddress: string;
  toChainId: number;
  toToken: string;
  fromChainId: number;
  fromToken: string;
  amountToken: number;
  tryType: string;
  bankId?: string;
  affiliator?: string;
}

export interface SubmitForgotPassword {
  email: string;
}

export interface SubmitVerifyOTP {
  email: string;
  otp_code: string;
}

export interface SubmitResetPassword {
  otp_code: string;
  new_password: string;
  confirm_password: string;
}

export interface TradingUser {
  id: string;
  email: string;
  fullname: string;
  avatar_url: string | null;
  is_google: boolean;
  is_active: boolean;
  is_management: boolean;
  login_count: number;
  swc_seed: number | null;
  /** Per-user EOA seed for deterministic unique EOA (Google flow). Returned by backend when supported. */
  eoa_seed?: string | null;
  kyc_status?: string | null;
  sub: string | null;
  created_at: string;
  updated_at: string;
  last_login: string;
}