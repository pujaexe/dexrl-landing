import type { TokenInterface } from "@/data";
const idrxIcon = "/icons/idrx.png";

export const MIN_AMOUNT_BUY = 20000;
export const MAX_AMOUNT_BUY = 10000000;

export const KYC_THRESHOLD = 3000000;

export const MIN_AMOUNT_SELL = 20000;
export const MAX_AMOUNT_SELL = 1000000;

export const POLYGON_CHAIN_ID = 137;
export const BASE_CHAIN_ID = 8453;
export const USDT_POLYGON_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
export const USDC_POLYGON_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const SOLANA_CHAIN_ID = 1151111081099710;
export const BITCOIN_CHAIN_ID = 20000000000001;

// Mirrors backend MIN_ONRAMP_AMOUNT_IDR_BY_CHAIN. BTC and high-gas chains have
// bridge minimums that cause "No routes found" downstream below these values.
export const MIN_AMOUNT_BUY_BY_CHAIN: Record<number, number> = {
    137: 20000,                  // Polygon
    1: 20000,                   // Ethereum
    56: 20000,                   // BSC
    8453: 20000,                 // Base
    [SOLANA_CHAIN_ID]: 30000,    // Solana
    [BITCOIN_CHAIN_ID]: 300000,  // Bitcoin (~$20)
};

export const getMinAmountBuy = (chainId?: number): number => {
    if (chainId === undefined || chainId === null) return MIN_AMOUNT_BUY;
    return MIN_AMOUNT_BUY_BY_CHAIN[Number(chainId)] ?? MIN_AMOUNT_BUY;
};

export const ONRAMP_GOOGLE_ACTIVE =
    process.env.NEXT_PUBLIC_ONRAMP_GOOGLE === "true";
export const ONRAMP_METAMASK_ACTIVE =
    process.env.NEXT_PUBLIC_ONRAMP_METAMASK === "true";

export const QUOTE_ADDRESS = process.env.NEXT_PUBLIC_EXAMPLE_QUOTE_ADDRESS;
export const SOLANA_QUOTE_ADDRESS = "1nc1nerator11111111111111111111111111111111";
// Slippage tolerance for DEX swaps (1% = 0.01)
// 0.1% was too low and caused frequent reverts on volatile pairs like USDT→POL
export const DEFAULT_SLIPPAGE = 0.01;

export const defaultFromToken: TokenInterface = {
    symbol: "IDRX",
    name: "IDRX",
    coinKey: "IDRX",
    logoURI: idrxIcon,
    chainId: undefined,
    address: "",
    decimals: 0,
    priceUSD: "",
    chain: {
        id: 1,
        key: "eth",
        name: "1 IDRX ≈ 1 IDR",
        metamask: {
            rpcUrls: [],
            blockExplorerUrls: [],
        },
        color: "#ffffff80",
    },
};

export const defaultToToken: TokenInterface = {
    symbol: "USDT",
    name: "Tether USD",
    coinKey: "USDT",
    logoURI: "/icons/usdt.png",
    chainId: 137,
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    priceUSD: "1",
    chain: {
        id: 137,
        key: "polygon",
        name: "Polygon",
        metamask: {
            rpcUrls: [
                "https://polygon-bor-rpc.publicnode.com",
                "https://polygon.drpc.org",
                process.env.NEXT_PUBLIC_POLYGON_RPC_URL as string,
            ],
            blockExplorerUrls: ["https://polygonscan.com/"],
        },
        color: "#8247E5",
    },
};
