import { supabase } from "../lib/supabaseClient";
import { apiRequest } from "./oxo/idrx/request";
import type { 
  PatchTransactionProgressRequest, 
  TransactionData,
  BridgeQuoteResponse,
  BridgeExecutionResponse
} from "../components/trading/WidgetPayment/WidgetPayment.types";

export async function saveUserTransaction(transaction: {
  toAddress: string;
  amount: number;
  transactionId: string;
  addressId: string;
  toChainId: number;
  fromChainId: number;
  toToken: string;
  fromToken: string;
  amountToken: number;
  tryType: string;
  bankId?: string;
  affiliator?: string;
  merchantOrderId?: string;
}) {
  const newTransaction = {
    trx_no: transaction.transactionId,
    trx_date: new Date(),
    amount: transaction.amount,
    status: "pending",
    trx_type: transaction.tryType,
    created_at: new Date(),
    address_id: transaction.addressId,
    to_address: transaction.toAddress,
    to_chain_id: transaction.toChainId,
    from_chain_id: transaction.fromChainId,
    to_token: transaction.toToken,
    from_token: transaction.fromToken,
    amount_token: transaction.amountToken,
    bank_id: transaction?.bankId || null,
    affiliator: transaction?.affiliator || undefined,
    merchant_order_id: transaction?.merchantOrderId || undefined,
  };

  return await apiRequest("/transactions/create", "POST", newTransaction);
}

export async function createTradingTransaction(transaction: {
  amount: number;
  toAddress: string;
  toChainId: number;
  fromChainId: number;
  toToken: string;
  fromToken: string;
  amountToken: number;
  addressId: string;
  affiliator: string;
}): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  return await apiRequest<{
    success: boolean;
    message: string;
    data: any;
  }>("/transactions/trading/create", "POST", {
    amount: transaction.amount,
    to_address: transaction.toAddress,
    to_chain_id: transaction.toChainId,
    from_chain_id: transaction.fromChainId,
    to_token: transaction.toToken,
    from_token: transaction.fromToken,
    amount_token: transaction.amountToken,
    address_id: transaction.addressId,
    trx_type: "buy",
    affiliator: transaction.affiliator,
  });
}

export interface IParamUpdateUserTransaction {
    updated_at?: Date;
    status?: string;
    payment_ref?: string;
    tx_hash?: string;
    burn_tx_hash?: string;
    merchant_order_id?: string;
    show_completed?: boolean;
    is_user_operation?: boolean;
}

export async function updateUserTransaction(
  trx_no: string,
  body: IParamUpdateUserTransaction
) {
  return await apiRequest("/transactions/" + trx_no, "PATCH", body);
}

export async function saveMintRequest(body: {
  user_id: string;
  request_type: string;
  amount_idr: string;
  amount_usdt: string;
  payment_ref: string;
  payment_url: string;
  wallet_target: string;
  status: string;
  merchant_order_id: string;
}): Promise<any> {
  return await apiRequest("/transactions/mint-request", "POST", body);
}

export async function getMintRequest(referenceId: string) {
  const { data, error } = await supabase
    .from("idrx_request")
    .select("*")
    .eq("payment_ref", referenceId)
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTransactionHistory(
  addressId: string,
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("history_transaction")
    .select(
      `
    trx_no,
    to_address,
    trx_type,
    amount_token,
    trx_date,
    status,
    address_id,
    amount,

    bank_list (*),

    from_chain:chain_list!history_transaction_from_chain_id_fkey (
      id,
      chain_name
    ),

    to_chain:chain_list!history_transaction_to_chain_id_fkey (
      id,
      chain_name
    ),

    from_token_detail:token_list!fk_from_token (
      token_address,
      token_symbol
    ),

    to_token_detail:token_list!fk_to_token (
      token_address,
      token_symbol
    )
  `,
      { count: "exact" }
    )
    // .eq("trx_type", trxType)
    .eq("address_id", addressId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search?.trim()) {
    query = query.or(`trx_no.ilike.%${search}%,to_address.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data.map((trx) => {
      return {
        ...trx,
        from_chain: trx?.from_chain as any,
        to_chain: trx?.to_chain as any,
        from_token_detail: trx?.from_token_detail as any,
        to_token_detail: trx?.to_token_detail as any,
        bank_list: trx?.bank_list as any,
      };
    }),
    meta: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function getSingleTransaction(addressId: string, trx: string) {
  const { data, error } = await supabase
    .from("history_transaction")
    .select(`
      *,
      from_chain:chain_list!history_transaction_from_chain_id_fkey (*),
      to_chain:chain_list!history_transaction_to_chain_id_fkey (*),
      from_token_detail:token_list!fk_from_token (*),
      to_token_detail:token_list!fk_to_token (*)
    `)
    .eq("address_id", addressId)
    .eq("trx_no", trx)
    .order("created_at", { ascending: false })
    .single();

  if (error) throw error;
  return data;
}

export const getTransaction = async (
  trx_no: string
): Promise<TransactionData> => {
  try {
    const response = await apiRequest<TransactionData>(
      "/transactions/" + trx_no,
      "GET",
      {}
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const patchTransactionProgress = async (
  trx_no: string,
  progress: PatchTransactionProgressRequest
) => {
  try {
    const response = await apiRequest<TransactionData>(
      "/transactions/progress/" + trx_no,
      "PATCH",
      progress
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get bridge quote for a transaction
 * @param trx_no - Transaction number
 * @param fromAddress - Optional from address
 * @returns Bridge quote response
 */
export const getBridgeQuote = async (
  trx_no: string,
  fromAddress?: string
): Promise<BridgeQuoteResponse> => {
  try {
    const queryParams = fromAddress ? { fromAddress } : {};
    const response = await apiRequest<BridgeQuoteResponse>(
      `/transactions/${trx_no}/bridge-quote`,
      "GET",
      queryParams
    );
    return response;
  } catch (error) {
    console.error("Error getting bridge quote:", error);
    throw error;
  }
};

/**
 * Prepare bridge execution for a transaction
 * @param trx_no - Transaction number
 * @param walletAddress - Wallet address for execution
 * @returns Bridge execution preparation data
 */
export const prepareBridgeExecution = async (
  trx_no: string,
  walletAddress: string
): Promise<BridgeExecutionResponse> => {
  try {
    const response = await apiRequest<BridgeExecutionResponse>(
      `/transactions/${trx_no}/prepare-bridge`,
      "POST",
      { walletAddress }
    );
    return response;
  } catch (error) {
    console.error("Error preparing bridge execution:", error);
    throw error;
  }
};

/**
 * Execute bridge - prepare execution data for smart account
 * @param trx_no - Transaction number
 * @param walletAddress - Wallet address for execution
 * @returns Execution data (calls for same-chain or transactionRequest for cross-chain)
 */
export const executeBridge = async (
  trx_no: string,
  walletAddress: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    trx_no: string;
    isSameChain: boolean;
    executionData: {
      calls?: Array<{
        to: string;
        data: string;
        value: string;
      }>;
      transactionRequest?: {
        to: string;
        data: string;
        value: string;
        gasLimit?: string;
        gasPrice?: string;
      };
      approvalAddress?: string;
      fromTokenAddress?: string;
    };
    chainId: number;
  };
}> => {
  try {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: {
        trx_no: string;
        isSameChain: boolean;
        executionData: {
          calls?: Array<{
            to: string;
            data: string;
            value: string;
          }>;
          transactionRequest?: {
            to: string;
            data: string;
            value: string;
            gasLimit?: string;
            gasPrice?: string;
          };
          approvalAddress?: string;
          fromTokenAddress?: string;
        };
        chainId: number;
      };
    }>(
      `/transactions/${trx_no}/execute-bridge`,
      "POST",
      { walletAddress }
    );
    return response;
  } catch (error) {
    console.error("Error executing bridge:", error);
    throw error;
  }
};

/**
 * Update bridge transaction with tx_hash after execution
 * @param trx_no - Transaction number
 * @param tx_hash - Transaction hash from execution
 * @returns Transaction hash
 */
export const updateBridgeTxHash = async (
  trx_no: string,
  tx_hash: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    tx_hash: string;
  };
}> => {
  try {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: {
        tx_hash: string;
      };
    }>(
      `/transactions/${trx_no}/update-bridge-txhash`,
      "POST",
      { tx_hash }
    );
    return response;
  } catch (error) {
    console.error("Error updating bridge transaction hash:", error);
    throw error;
  }
};