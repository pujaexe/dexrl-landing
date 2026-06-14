import { createPublicClient, erc20Abi, formatUnits, http, type Chain } from "viem";
import { mainnet, polygon, base, bsc } from "viem/chains";

// OXO supported chain IDs
export const CHAIN_IDS = {
    ETHEREUM: 1,
    BSC: 56,
    POLYGON: 137,
    BASE: 8453,
    SOLANA: 1151111081099710,
    BITCOIN: 20000000000001,
} as const;

// EVM chain configurations
const EVM_CHAIN_CONFIGS: Record<number, { chain: Chain; rpcUrl: string }> = {
    [CHAIN_IDS.ETHEREUM]: {
        chain: mainnet,
        rpcUrl: "https://eth.llamarpc.com",
    },
    [CHAIN_IDS.BSC]: {
        chain: bsc,
        rpcUrl: "https://bsc-dataseed.binance.org",
    },
    [CHAIN_IDS.POLYGON]: {
        chain: polygon,
        rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon.llamarpc.com",
    },
    [CHAIN_IDS.BASE]: {
        chain: base,
        rpcUrl: "https://mainnet.base.org",
    },
};

// Solana RPC
const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

// Bitcoin API (using mempool.space)
const BITCOIN_API_URL = "https://mempool.space/api";

const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Check if chain is EVM-based
 */
export function isEVMChain(chainId: number): boolean {
    return chainId in EVM_CHAIN_CONFIGS;
}

/**
 * Check if chain is Solana
 */
export function isSolanaChain(chainId: number): boolean {
    return chainId === CHAIN_IDS.SOLANA;
}

/**
 * Check if chain is Bitcoin
 */
export function isBitcoinChain(chainId: number): boolean {
    return chainId === CHAIN_IDS.BITCOIN;
}

/**
 * Check if a chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
    return isEVMChain(chainId) || isSolanaChain(chainId) || isBitcoinChain(chainId);
}

/**
 * Check if token address represents a native token
 */
export function isNativeTokenAddress(tokenAddress?: string): boolean {
    return !tokenAddress || tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
}

/**
 * Get EVM public client
 */
function getEVMPublicClient(chainId: number) {
    const config = EVM_CHAIN_CONFIGS[chainId];
    if (!config) {
        throw new Error(`Unsupported EVM chain: ${chainId}`);
    }
    return createPublicClient({
        chain: config.chain,
        transport: http(config.rpcUrl),
    });
}

/**
 * Get EVM balance (native or ERC-20)
 */
async function getEVMBalance(
    walletAddress: `0x${string}`,
    chainId: number,
    tokenAddress?: string,
    decimals: number = 18
): Promise<{ raw: string; formatted: string }> {
    const client = getEVMPublicClient(chainId);

    if (isNativeTokenAddress(tokenAddress)) {
        const balance = await client.getBalance({ address: walletAddress });
        const config = EVM_CHAIN_CONFIGS[chainId];
        const nativeDecimals = config.chain.nativeCurrency?.decimals ?? 18;
        return {
            raw: balance.toString(),
            formatted: formatUnits(balance, nativeDecimals),
        };
    }

    const balance = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [walletAddress],
    });

    return {
        raw: balance.toString(),
        formatted: formatUnits(balance, decimals),
    };
}

/**
 * Get Solana SOL balance
 */
async function getSolanaBalance(
    walletAddress: string
): Promise<{ raw: string; formatted: string }> {
    const response = await fetch(SOLANA_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [walletAddress],
        }),
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || "Failed to get Solana balance");
    }

    const lamports = data.result?.value ?? 0;
    const solBalance = lamports / 1e9; // 1 SOL = 10^9 lamports

    return {
        raw: lamports.toString(),
        formatted: solBalance.toString(),
    };
}

/**
 * Get Solana SPL token balance
 */
async function getSolanaSPLTokenBalance(
    walletAddress: string,
    tokenMintAddress: string,
    decimals: number = 9
): Promise<{ raw: string; formatted: string }> {
    const response = await fetch(SOLANA_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
                walletAddress,
                { mint: tokenMintAddress },
                { encoding: "jsonParsed" },
            ],
        }),
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || "Failed to get SPL token balance");
    }

    const accounts = data.result?.value || [];
    if (accounts.length === 0) {
        return { raw: "0", formatted: "0" };
    }

    const tokenAmount = accounts[0]?.account?.data?.parsed?.info?.tokenAmount;
    const rawAmount = tokenAmount?.amount ?? "0";
    const tokenDecimals = tokenAmount?.decimals ?? decimals;

    return {
        raw: rawAmount,
        formatted: formatUnits(BigInt(rawAmount), tokenDecimals),
    };
}

/**
 * Get Bitcoin balance
 */
async function getBitcoinBalance(
    walletAddress: string
): Promise<{ raw: string; formatted: string }> {
    const response = await fetch(`${BITCOIN_API_URL}/address/${walletAddress}`);

    if (!response.ok) {
        throw new Error("Failed to get Bitcoin balance");
    }

    const data = await response.json();
    const satoshis = (data.chain_stats?.funded_txo_sum ?? 0) - (data.chain_stats?.spent_txo_sum ?? 0);
    const btcBalance = satoshis / 1e8; // 1 BTC = 10^8 satoshis

    return {
        raw: satoshis.toString(),
        formatted: btcBalance.toString(),
    };
}

/**
 * Get wallet balance for any supported chain
 * Main function to use for getting token balance
 */
export async function getMetamaskBalance(
    walletAddress: string,
    chainId: number,
    tokenAddress?: string,
    decimals: number = 18
): Promise<{ raw: string; formatted: string }> {
    if (!isSupportedChain(chainId)) {
        throw new Error(`Chain ${chainId} is not supported`);
    }

    // EVM chains
    if (isEVMChain(chainId)) {
        return getEVMBalance(walletAddress as `0x${string}`, chainId, tokenAddress, decimals);
    }

    // Solana
    if (isSolanaChain(chainId)) {
        if (isNativeTokenAddress(tokenAddress)) {
            return getSolanaBalance(walletAddress);
        }
        return getSolanaSPLTokenBalance(walletAddress, tokenAddress!, decimals);
    }

    // Bitcoin (only supports native BTC)
    if (isBitcoinChain(chainId)) {
        return getBitcoinBalance(walletAddress);
    }

    throw new Error(`Chain ${chainId} is not supported`);
}
