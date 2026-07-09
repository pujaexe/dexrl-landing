"use client";

export interface IStep {
    icon: string;
    title: string;
    description: string;
    status: string;
    type: string;
    time: number;
    code: string;
    index: number;
}

export const USDT_POL_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

export const transactionSteps: IStep[] = [
    {
        icon: "lucide:check-circle",
        title: "Order Initiated",
        description: "#TX-857147 | May 15, 2023 - 14:32",
        status: "completed",
        type: "text",
        time: 1000,
        code: "ORDER_INITIATED",
        index: 0,
    },
    {
        icon: "lucide:coins",
        title: "Minting Stablecoin",
        description: "Incoming 1,000,000 IDRX",
        status: "completed",
        type: "text",
        time: 1000,
        code: "MINTING_STABLECOIN",
        index: 1,
    },
    {
        icon: "lucide:search",
        title: "Routing Best Price",
        description: "Scanning liquidity across DEXs",
        status: "completed",
        type: "text",
        time: 1000,
        code: "ROUTING_BEST_PRICE",
        index: 2,
    },
    {
        icon: "mingcute:flash-line",
        title: "Executing Swap",
        description: "Swapping to 0.0002 BTC (Bitcoin)",
        status: "inprogress",
        type: "text",
        time: 1000,
        code: "EXECUTING_SWAP",
        index: 3,
    },
    {
        icon: "lucide:wallet",
        title: "Transfer to Wallet",
        description: "0x531as531as1sa...CaE5E",
        status: "pending",
        type: "link",
        time: 1000,
        code: "SETTLEMENT",
        index: 4,
    },
];

export const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
];