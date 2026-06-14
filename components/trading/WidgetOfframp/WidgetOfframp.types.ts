"use client";

// Offramp-specific step codes
export type OfframpStepCode =
    | "ORDER_INITIATED"
    | "ROUTING_BEST_PRICE"
    | "EXECUTING_SWAP"
    | "INITIATING_REDEMPTION"
    | "TRANSFER_TO_BANK";

// Offramp UI mode based on login method
export type OfframpMode = "deposit_instruction" | "redemption_process";

// Offramp transaction status
export type OfframpTransactionStatus =
    | "pending"
    | "awaiting_deposit"
    | "deposit_detected"
    | "inprogress"
    | "settlement"
    | "failed"
    | "completed"
    | "cancelled"
    | "expired";

export interface OfframpProgressItem {
    icon: string;
    title: string;
    description: string;
    status: "completed" | "inprogress" | "pending" | "failed" | string;
    type: "text" | "link";
    time: number;
    date: string;
    code: OfframpStepCode;
    index: number;
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

export interface BankAccount {
    id: string;
    bank_name: string;
    bank_code: string;
    bank_account_number: string;
    bank_account_name: string;
    logo_url?: string;
}

export interface Affiliator {
    id: string;
    email: string;
}

export interface OfframpDepositAddress {
    address: string;
    chain_id: number;
    expected_amount: number;
    expected_token: string;
    status: "PENDING" | "DETECTED" | "CONFIRMED" | "EXPIRED";
    expires_at: string;
}

export interface OfframpTransactionData {
    id: string;
    trx_no: string;
    trx_date: string;
    amount: number; // IDR amount to receive
    amount_token: number; // Crypto amount to deposit
    status: OfframpTransactionStatus;
    address_id: string;
    to_address: string;
    deposit_address?: OfframpDepositAddress;
    payment_ref: string;
    tx_hash: string;
    burn_tx_hash?: string;
    progress: OfframpProgressItem[];
    affiliator?: Affiliator;
    from_chain: Chain;
    to_chain: Chain;
    from_token: Token;
    to_token: Token;
    bank_account?: BankAccount;
    market_price: number;
    show_completed: boolean;
    is_user_operation: boolean;
    expires_at?: string;
}

// API Response types
export interface OfframpTransactionResponse {
    success: boolean;
    message: string;
    data: OfframpTransactionData;
}

export interface ConfirmDepositResponse {
    success: boolean;
    message: string;
    data: {
        status: string;
        deposit_detected: boolean;
    };
}

export interface DepositStatusResponse {
    success: boolean;
    message: string;
    data: {
        status: "PENDING" | "DETECTED" | "CONFIRMED" | "EXPIRED";
        tx_hash?: string;
        detected_amount?: number;
        detected_at?: string;
    };
}
