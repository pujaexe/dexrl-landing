"use client";

import type { OfframpStepCode } from "./WidgetOfframp.types";

export interface IOfframpStep {
    icon: string;
    title: string;
    description: string;
    status: string;
    type: string;
    time: number;
    code: OfframpStepCode;
    index: number;
}

// 5 Offramp Steps (different from onramp - no MINTING step, has REDEMPTION step)
export const offrampSteps: IOfframpStep[] = [
    {
        icon: "lucide:check-circle",
        title: "Order Initiated",
        description: "#TX-{trx_no} | {date}",
        status: "pending",
        type: "text",
        time: 0,
        code: "ORDER_INITIATED",
        index: 0,
    },
    {
        icon: "lucide:search",
        title: "Routing Best Price",
        description: "Scanning liquidity across DEXs",
        status: "pending",
        type: "text",
        time: 0,
        code: "ROUTING_BEST_PRICE",
        index: 1,
    },
    {
        icon: "mingcute:flash-line",
        title: "Executing Swap",
        description: "Swapping to {amount} IDRX",
        status: "pending",
        type: "text",
        time: 0,
        code: "EXECUTING_SWAP",
        index: 2,
    },
    {
        icon: "lucide:flame",
        title: "Initiating Redemption",
        description: "Burning IDRX for fiat allocation",
        status: "pending",
        type: "text",
        time: 0,
        code: "INITIATING_REDEMPTION",
        index: 3,
    },
    {
        icon: "lucide:building-2",
        title: "Transfer to Bank Account",
        description: "Processed by IDRX to Bank Account",
        status: "pending",
        type: "text",
        time: 0,
        code: "TRANSFER_TO_BANK",
        index: 4,
    },
];

// Deposit instruction validity (10 minutes in milliseconds)
export const DEPOSIT_VALIDITY_MS = 10 * 60 * 1000;

// USDT token address on Polygon
export const USDT_POL_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

// IDRX token address on Polygon
export const IDRX_POL_ADDRESS = "0x18dB5C87f5c39f8abaFBe9353bb9f7e6f3a7047C";

// Supported chains for offramp deposit
export const SUPPORTED_CHAINS = [
    {
        chainId: 1,
        name: "Ethereum",
        symbol: "ETH",
        explorerUrl: "https://etherscan.io",
    },
    {
        chainId: 137,
        name: "Polygon",
        symbol: "POL",
        explorerUrl: "https://polygonscan.com",
    },
    {
        chainId: 56,
        name: "BNB Smart Chain",
        symbol: "BSC",
        explorerUrl: "https://bscscan.com",
    },
    {
        chainId: 8453,
        name: "Base",
        symbol: "BASE",
        explorerUrl: "https://basescan.org",
    },
    {
        chainId: 1151111081099710,
        name: "Solana",
        symbol: "SOL",
        explorerUrl: "https://solscan.io",
    },
    {
        chainId: 20000000000001,
        name: "Bitcoin",
        symbol: "BTC",
        explorerUrl: "https://mempool.space",
    },
];

// Helper to get explorer URL for transaction
export const getExplorerTxUrl = (chainId: number, txHash: string): string => {
    const chain = SUPPORTED_CHAINS.find((c) => c.chainId === chainId);
    if (!chain) return "";
    return `${chain.explorerUrl}/tx/${txHash}`;
};

// Helper to get explorer URL for address
export const getExplorerAddressUrl = (
    chainId: number,
    address: string
): string => {
    const chain = SUPPORTED_CHAINS.find((c) => c.chainId === chainId);
    if (!chain) return "";
    // Solana uses /account/ instead of /address/
    if (chainId === 1151111081099710) {
        return `${chain.explorerUrl}/account/${address}`;
    }
    return `${chain.explorerUrl}/address/${address}`;
};

// ERC20 ABI for token operations
export const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
];
