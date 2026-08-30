import { lifiService } from "@/services/lifiService";
import { formatEther } from "ethers";
import { createPublicClient, createWalletClient, custom, erc20Abi, encodeFunctionData, http, type Chain } from "viem";
import { base, polygon, mainnet, bsc } from "viem/chains";

// Supported EVM chains configuration
const SUPPORTED_CHAINS: Record<number, { chain: Chain; rpcUrl: string }> = {
  1: {
    chain: mainnet,
    rpcUrl: process.env.NEXT_PUBLIC_ETH_RPC_URL || "https://rpc.ankr.com/eth",
  },
  56: {
    chain: bsc,
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC_URL || "https://rpc.ankr.com/bsc",
  },
  137: {
    chain: polygon,
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://rpc.ankr.com/polygon",
  },
  8453: {
    chain: base,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://rpc.ankr.com/base",
  },
};

export const normalizeUserOpResult = async (raw: any) => {
  if (!raw) return { userOpHash: null, txHash: null, raw };
  let userOpHash: string | null = null;
  let txHash: string | null = null;

  if (typeof raw === "string") txHash = raw;

  userOpHash =
    raw?.userOpHash ?? raw?.userOpHashHex ?? raw?.id ?? raw?.hash ?? null;

  if (typeof raw?.waitForTxHash === "function") {
    try {
      const waited = await raw.waitForTxHash();
      if (typeof waited === "string") txHash = waited;
    } catch { }
  }

  txHash =
    txHash ?? raw?.txHash ?? raw?.receipt?.transactionHash ?? raw?.hash ?? null;

  return { userOpHash, txHash, raw };
};

export const sendUserOpAndWait = async (
  smartAccount: any,
  tx: {
    token?: string;
    amount?: bigint;
    ownerClient?: any;
    to?: string;
    data?: string;
    value?: bigint | number | string;
    calls?: any[];
  },
  extra: {
    approvalAddress: string;
    pimlicoClient?: any;
    waitForReceipt?: boolean;
    fromTokenAddress?: string;
  }
) => {
  if (!smartAccount) throw new Error("smartAccount missing");

  // 🆕 Allowance auto-check here only when needed

  const isSolana = !extra.approvalAddress || extra.approvalAddress === "solana";

  // === SOLANA: Do NOT append approve() ===
  if (isSolana) {
    console.log("🚀 Wallet Client", smartAccount);
    const payload: any = {
      calls: [
        {
          to: tx.to,
          data: tx.data,
          value: BigInt(tx.value || 0),
        },
      ],
    }
    const { result, isUserOperation } = await sendTokenUser(smartAccount, payload)
    return { ...result, isUserOperation }
  }

  const payload: any =
    tx.calls ??
    (tx.to
      ? {
        calls: [
          {
            to: extra.fromTokenAddress,
            data: lifiService.encodeApproveCalldata(
              extra.approvalAddress,
              BigInt(
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
              )
            ),
            value: 0n,
          },
          {
            to: tx.to,
            data: tx.data ?? "0x",
            value:
              typeof tx.value === "bigint" ? tx.value : BigInt(tx.value ?? 0),
          },
        ],
      }
      : tx);

  const { result: rawResult, isUserOperation } = await sendTokenUser(smartAccount, payload)

  const normalized = await normalizeUserOpResult(rawResult);

  if (extra?.waitForReceipt && extra?.pimlicoClient && normalized.userOpHash) {
    const status = await extra.pimlicoClient.getUserOperationStatus(
      normalized.userOpHash
    );
    if (status) {
      normalized.txHash ??=
        status.transactionHash ?? (status as any).txHash ?? null;
    }
  }

  return { ...normalized, isUserOperation };
};

const sendTokenUser = async (smartAccount: any, payload: any) => {
  if (typeof smartAccount.sendTransaction === "function") {
    try {
      const result = await smartAccount.sendTransaction(payload);
      return {
        result,
        isUserOperation: false
      }
    } catch (e) {
      if (typeof smartAccount.sendUserOperation === "function") {
        const result = await smartAccount.sendUserOperation(payload);
        return {
          result,
          isUserOperation: true
        }
      } else {
        throw e;
      }
    }
  } else if (typeof smartAccount.sendUserOperation === "function") {
    const result = await smartAccount.sendUserOperation(payload);
    return {
      result,
      isUserOperation: true
    }
  } else {
    throw new Error(
      "smartAccount does not expose sendTransaction or sendUserOperation"
    );
  }
}

export function getPublicClient(chainId: number) {
  const config = SUPPORTED_CHAINS[chainId];

  if (!config) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }

  return createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });
}

export async function getSwcNativeBalance(
  swcAddress: `0x${string}`,
  chainId: number
) {
  const client = getPublicClient(chainId);
  const balance = await client.getBalance({ address: swcAddress });

  return {
    raw: balance, // bigint
    formatted: formatEther(balance), // string in ETH/MATIC/BNB
  };
}

export async function getSwcTokenBalance(
  tokenAddress: `0x${string}`,
  swcAddress: `0x${string}`,
  chainId: number
) {
  const client = getPublicClient(chainId);

  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [swcAddress],
  });

  return balance.toString(); // bigint
}

export async function getSwcBalances(
  chainId: number,
  swcAddress: `0x${string}`,
  token: `0x${string}`
) {
  const native = await getSwcNativeBalance(swcAddress, chainId);

  const erc20Balances = await getSwcTokenBalance(token, swcAddress, chainId);

  return {
    chainId,
    swcAddress,
    nativeBalance: native.formatted,
    swcBalance: erc20Balances,
  };
}

export const createEOAWalletClient = (chainId: number) => {
  if (!window.ethereum) {
    throw new Error("No injected wallet found");
  }

  const config = SUPPORTED_CHAINS[chainId];

  if (!config) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }

  return createWalletClient({
    chain: config.chain,
    transport: custom(window.ethereum),
  });
};

// Zero address represents native tokens (ETH, POL, etc.)
const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Check if token address represents a native token
 */
const isNativeToken = (tokenAddress: string): boolean => {
  return !tokenAddress || tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
};

/**
 * Switch wallet to the target chain
 */
export async function switchToChain(chainId: number): Promise<void> {
  if (!window.ethereum) {
    throw new Error("No injected wallet found");
  }

  const config = SUPPORTED_CHAINS[chainId];
  if (!config) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }

  const hexChainId = `0x${chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError: any) {
    // Chain not added to wallet, try to add it
    if (switchError.code === 4902) {
      const { chain } = config;
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: chain.blockExplorers?.default?.url
              ? [chain.blockExplorers.default.url]
              : undefined,
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

export async function transferTokenToSWC(
  chainId: number,
  fromAddress: `0x${string}`,
  toAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  amount: bigint
): Promise<`0x${string}`> {
  const config = SUPPORTED_CHAINS[chainId];
  if (!config) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }

  // Switch wallet to the target chain first
  await switchToChain(chainId);

  const walletClient = createEOAWalletClient(chainId);
  const publicClient = getPublicClient(chainId);
  const chain = config.chain;

  let hash: `0x${string}`;

  // Check if this is a native token transfer (POL, ETH, etc.)
  if (isNativeToken(tokenAddress)) {
    console.log("[transferTokenToSWC] Native token transfer detected");
    // Native token transfer - send value directly to recipient
    hash = await walletClient.sendTransaction({
      account: fromAddress,
      to: toAddress,
      value: amount,
      chain,
    });
  } else {
    // ERC20 token transfer - call transfer function on token contract
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress, amount],
    });

    hash = await walletClient.sendTransaction({
      account: fromAddress,
      to: tokenAddress,
      data,
      chain,
    });
  }

  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
}