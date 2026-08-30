import { apiRequest } from "./request";

export const getIdrRates = (idrxAmount: number) =>
  apiRequest<{
    data: {
      price: string;
      buyAmount: string;
      chainId: number;
    };
  }>(`/transaction/rates`, "GET", {
    idrxAmount,
  });

export const getUsdtRates = (usdtAmount: number) =>
  apiRequest<{
    data: {
      price: string;
      buyAmount: string;
      chainId: number;
    };
  }>(`/transaction/rates`, "GET", {
    usdtAmount,
  });
export const mintRequest = (body: {
  toBeMinted: string;
  destinationWalletAddress: string;
  expiryPeriod: number;
  networkChainId: number;
  requestType: string;
}) =>
  apiRequest<{
    data: { paymentUrl: string; reference: string; merchantOrderId: string };
  }>(`/transaction/mint-request`, "POST", body);

export const transactionHistory = (query: {
  transactionType: string; // "MINT" | "BURN" | "BRIDGE" | "DEPOSIT_REDEEM"
  page: number;
  take: number;
  userMintStatus?: string;
  paymentStatus?: string;
  orderByDate?: string;
  txHash?: string;
  merchantOrderId?: string;
}) => apiRequest(`/transaction/user-transaction-history`, "GET", query);

export const addBankAccount = (body: {
  bankAccountNumber: string;
  bankCode: string;
}) =>
  apiRequest<{
    data: {
      id: number;
      bankAccountName: string;
      bankAccountNumber: string;
      bankCode: string;
      bankName: string;
      maxAmountTransfer: number;
    };
  }>("/auth/add-bank-account", "POST", body);

export interface IdrxBankAccount {
  id: number;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  bankName: string;
  maxAmountTransfer: string;
  DepositWalletAddress?: {
    walletAddress: string;
    createdAt: string;
  };
}

export const getBankAccounts = () =>
  apiRequest<{
    data: IdrxBankAccount[];
  }>("/auth/get-bank-accounts", "GET", {});

// Check if a specific bank account exists in IDRX for current user
export const checkBankAccountInIdrx = async (bankAccountNumber: string): Promise<IdrxBankAccount | null> => {
  try {
    const response = await getBankAccounts();
    const accounts = response?.data || [];
    return accounts.find(acc => acc.bankAccountNumber === bankAccountNumber) || null;
  } catch {
    return null;
  }
};

export const deleteBankAccount = (bankId: number) =>
  apiRequest(`/auth/delete-bank-account/${bankId}`, "DELETE", {});

export const getBankTransfer = () =>
  apiRequest<{
    data: {
      bankCode: string;
      bankName: string;
    }[];
  }>("/transaction/method", "GET", {});

export const redeemTokenIdrx = (body: {
  txHash: string;
  networkChainId: number;
  amountTransfer: string; // Use IDR amount instead of USDC
  bankAccount: string; // Extract account number
  bankCode: string;
  bankName: string;
  bankAccountName: string;
  walletAddress: string; // ✅ Use SWC address instead of EOA
  currency: string; // Specify currency as IDR}) => {
}) => apiRequest("/transaction/redeem-request", "POST", body);

export const singleUserTransactionhistory = (trx_no: string) =>
  apiRequest(`/transactions/${trx_no}`, "GET", {});
