import { apiRequest } from "./oxo/idrx/request";

export interface QuoteRequest {
    amountInIdr?: number;
    toChainId?: number;
    toTokenAddress?: string;
    fromAddress?: string;
    toAddress?: string;
}

export interface QuoteData {
    id: string;
    fromChain: number;
    toChain: number;
    fromToken: string;
    toToken: string;
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    minAmountIdr?: number;
    belowMinimum?: boolean;
    gasCost: string;
    estimatedDuration: number;
    toolDetail?: {
        logoURI: string;
        name: string;
    }
}

export interface QuoteResponse {
    success: boolean;
    message: string;
    data: QuoteData;
}

/**
 * Get onramp quote for converting IDR to crypto
 */
export const getQuote = async (params: QuoteRequest): Promise<QuoteData> => {
    const response = await apiRequest<QuoteResponse>(
        "/onramp/get-quote",
        "POST",
        params,
    );

    if (!response) {
        throw new Error("Business list not found");
    }
    return response.data;
};

export interface BackendSmartAccountRequest {
    swc_seed: number;
    chainId: number;
}

export interface BackendSmartAccountResponse {
    success: boolean;
    message: string;
    data: {
        smartAccountAddress: string;
        eoaAddress: string;
        derivationIndex: number;
        chainId: number;
    };
}

/**
 * Get backend-derived Smart Account address for onramp
 * IDRX will mint USDT to this address, backend will execute swap from here
 */
export const getBackendSmartAccountAddress = async (
    swc_seed: number,
    chainId: number
): Promise<BackendSmartAccountResponse['data']> => {
    const response = await apiRequest<BackendSmartAccountResponse>(
        "/onramp/get-backend-smart-account",
        "POST",
        { swc_seed, chainId },
    );

    if (!response || !response.data) {
        throw new Error("Failed to get backend Smart Account address");
    }
    return response.data;
};
