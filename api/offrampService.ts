import { apiRequest } from "./oxo/idrx/request";

export interface OfframpQuoteRequest {
    amountToken: number;
    fromChainId: number;
    fromTokenAddress: string;
    fromAddress?: string;
}

export interface OfframpQuoteData {
    id: string;
    fromChain: number;
    toChain: number;
    fromToken: string;
    toToken: string;
    fromAmount: number;
    toAmount: string;
    toAmountMin: string;
    toAmountIdr: number;
    minAmountIdr?: number;
    belowMinimum?: boolean;
    gasCost: string;
    estimatedDuration: number;
    toolDetail?: {
        logoURI: string;
        name: string;
    };
}

export interface OfframpQuoteResponse {
    success: boolean;
    message: string;
    data: OfframpQuoteData;
}

export interface CreateOfframpTransactionRequest {
    amount: number; // IDR amount to receive
    address_id: string;
    from_chain_id: number;
    from_token: string;
    amount_token: number;
    bank_id: string;
    affiliator?: string;
}

export interface OfframpTransactionResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        trx_no: string;
        trx_date: string;
        amount: number;
        amount_token: number;
        status: string;
        trx_type: string;
        from_chain_id: number;
        from_token: string;
        bank_account: {
            id: string;
            bank_name: string;
            bank_code: string;
            bank_account_number: string;
            bank_account_name: string;
            logo_url?: string;
        };
        deposit_address?: {
            address: string;
            chain_id: number;
            expected_amount: number;
            expected_token: string;
            status: string;
            expires_at: string;
        };
        created_at: string;
        updated_at: string;
    };
}

/**
 * Get offramp quote for converting crypto to IDR
 */
export const getOfframpQuote = async (params: OfframpQuoteRequest): Promise<OfframpQuoteData> => {
    const response = await apiRequest<OfframpQuoteResponse>(
        "/offramp/get-quote",
        "POST",
        params,
    );

    if (!response || !response.data) {
        throw new Error("Failed to get offramp quote");
    }
    return response.data;
};

/**
 * Create offramp transaction with deposit address
 */
export const createOfframpTransaction = async (
    transaction: CreateOfframpTransactionRequest
): Promise<OfframpTransactionResponse> => {
    return await apiRequest<OfframpTransactionResponse>(
        "/offramp/create",
        "POST",
        transaction
    );
};

/**
 * Get offramp transaction details
 */
export const getOfframpTransaction = async (txNo: string) => {
    return await apiRequest<any>(
        `/offramp/${txNo}`,
        "GET",
        {}
    );
};

/**
 * Confirm user deposit ("I've Paid" button)
 */
export const confirmOfframpDeposit = async (txNo: string) => {
    return await apiRequest<any>(
        `/offramp/${txNo}/confirm-deposit`,
        "POST",
        {}
    );
};

/**
 * Get deposit status for a transaction
 */
export const getOfframpDepositStatus = async (txNo: string) => {
    return await apiRequest<any>(
        `/offramp/${txNo}/deposit-status`,
        "GET",
        {}
    );
};

/**
 * Cancel offramp transaction
 */
export const cancelOfframpTransaction = async (txNo: string) => {
    return await apiRequest<any>(
        `/offramp/${txNo}/cancel`,
        "POST",
        {}
    );
};

/**
 * Retry offramp deposit watching (for expired deposits)
 */
export const retryOfframpDeposit = async (txNo: string) => {
    return await apiRequest<any>(
        `/offramp/${txNo}/retry-deposit`,
        "POST",
        {}
    );
};
