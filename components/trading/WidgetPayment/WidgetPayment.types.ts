"use client";

export interface ProgressItem {
    icon: string;
    title: string;
    description: string;
    status: "completed" | "inprogress" | "pending" | string;
    type: string;
    time: number;
    date: string;
    code: string;
    index: number;
}

export interface Affiliator {
    id: string;
    email: string;
}

export interface Chain {
    color: string;
    chain_id: number;
    logo_url: string;
    rpc_urls: string[];
    chain_key: string;
    is_active: boolean;
    chain_name: string;
    block_explorer_urls: string[];
    native_token_address: string;
}

export interface Token {
    id: string;
    chain_id: number;
    logo_url: string;
    token_name: string;
    token_symbol: string;
    token_address: string;
    token_decimals: number;
}

export interface TransactionData {
    id: string;
    trx_no: string;
    trx_date: string;
    amount: number;
    status:
    | "pending"
    | "inprogress"
    | "settlement"
    | "failed"
    | "completed"
    | "cancelled";
    address_id: string;
    to_address: string;
    amount_token: number;
    payment_ref: string;
    tx_hash: string;
    progress: ProgressItem[];
    affiliator: Affiliator;
    from_chain: Chain;
    to_chain: Chain;
    from_token: Token;
    to_token: Token;
    market_price: number;
    show_completed: boolean;
    is_user_operation: boolean;
}

export interface PatchTransactionProgressRequest {
    code: string;
    status: string;
}

// Bridge API Types
export interface BridgeQuote {
    transaction: TransactionData;
    bridgeQuote: {
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
        isSameChain: boolean;
        usdtAmount?: string;
        formattedAmount?: string;
        quoteResult?: any;
    }
}

export interface BridgeQuoteResponse {
    success: boolean;
    message: string;
    data: BridgeQuote;
}

export interface BridgeExecutionTransaction {
    id: string;
    amount: number;
    amount_token: number;
    from_chain_id: number;
    to_chain_id: number;
    from_token: string;
    to_token: string;
    to_address: string;
}

export interface BridgeExecutionData {
    isSameChain: boolean;
    usdtAmount: string;
    fromAddress: string;
    toAddress: string;
}

export interface BridgeExecutionResponse {
    success: boolean;
    message: string;
    data: {
        trx_no: string;
        transaction: BridgeExecutionTransaction;
        execution: BridgeExecutionData;
        bridgeQuote: BridgeQuote | null;
    };
}