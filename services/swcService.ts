// src/services/swcPimlicoService.ts
import { createSmartAccountClient } from "permissionless";
import { toKernelSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import type { Account } from "viem";
import { createPublicClient, createWalletClient, custom, http, keccak256 } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { base, mainnet, polygon } from "viem/chains";
import { upsertEOAAddress, upsertSWCAddress } from "./addressService";

export interface SWCResult {
  smartAccount: any;
  address: string;
  swcAddress?: string;
  chainId: number;
  addressRecord?: any;
  /** EOA address (user's second wallet) */
  eoaAddress: string;
  /** EOA address record from backend */
  eoaRecord?: any;
  /** Only for Google flow: viem EOA account for signing (e.g. swap to BTC) */
  eoaAccount?: any;
}

export const POLYGON_CHAIN_ID = 137;
export const BSC_CHAIN_ID = 56;
export const BASE_CHAIN_ID = 8453;

const DEFAULT_CONFIG = {
  chains: {
    137: {
      chainId: 137,
      name: "polygon",
      rpc:
        (process.env.NEXT_PUBLIC_POLYGON_RPC_URL as string) ||
        "https://polygon-rpc.com",
    },
    1: {
      chainId: 1,
      name: "ethereum",
      rpc:
        (process.env.NEXT_PUBLIC_ETH_RPC_URL as string) ||
        "https://rpc.ankr.com/eth",
    },
    8453: {
      chainId: 8453,
      name: "base",
      rpc:
        (process.env.NEXT_PUBLIC_BASE_RPC_URL as string) ||
        "https://mainnet.base.org", // RPC resmi Base
    },
  },
  pimlicoApiKey: (process.env.NEXT_PUBLIC_PIMLICO_API_KEY as string) || "",
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7" as const,
  },
};

function getRpcUrl(chainId: number): string {
  const cfg = (DEFAULT_CONFIG.chains as Record<number, any>)[chainId];
  if (!cfg) throw new Error(`Unsupported chain ${chainId}`);
  return cfg.rpc;
}

function createBundlerTransportUrl(chainId: number) {
  if (!DEFAULT_CONFIG.pimlicoApiKey) throw new Error("Missing PIMLICO API KEY");
  return `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${DEFAULT_CONFIG.pimlicoApiKey}`;
}

/** Derive a deterministic EOA (viem Account) from a per-user seed. Same seed → same address on any device. */
function deriveEoaAccountFromSeed(eoaSeed: string): Account {
  const bytes = new TextEncoder().encode(eoaSeed);
  const hex =
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  const privateKey = keccak256(hex as `0x${string}`);
  return privateKeyToAccount(privateKey);
}

export async function createSWCForGoogleUser(
  userId: string,
  swcSeed: number,
  privateKey?: string,
  chainId = POLYGON_CHAIN_ID,
  eoaSeed?: string | null
): Promise<SWCResult | null> {
  if (!privateKey) return null;
  const rpcUrl = getRpcUrl(chainId);
  const chain = chainId === POLYGON_CHAIN_ID ? polygon : base;
  const publicClient = createPublicClient({ transport: http(rpcUrl), chain });
  const bundlerUrl = createBundlerTransportUrl(chainId);

  const ownerAccount = privateKeyToAccount(
    `0x${privateKey.replace(/^0x/, "")}` as `0x${string}`
  );
  const eoaAccount = eoaSeed
    ? deriveEoaAccountFromSeed(eoaSeed)
    : ownerAccount;

  const ecdsaAccount = await toKernelSmartAccount({
    client: publicClient,
    owners: [ownerAccount],
    entryPoint: DEFAULT_CONFIG.entryPoint,
    index: BigInt(swcSeed),
  });

  const pimlicoClient = createPimlicoClient({
    transport: http(bundlerUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  const smartAccountClient = createSmartAccountClient({
    account: ecdsaAccount,
    chain,
    bundlerTransport: http(bundlerUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  const addressRecord = await upsertSWCAddress(userId, ecdsaAccount.address, 'google');
  const eoaRecord = await upsertEOAAddress(userId, eoaAccount.address, 'google');

  return {
    smartAccount: smartAccountClient,
    address: ecdsaAccount.address,
    swcAddress: ecdsaAccount.address,
    chainId,
    addressRecord,
    eoaAddress: eoaAccount.address,
    eoaRecord,
    eoaAccount,
  };
}

export async function createSwcMetamask(
  userId: string,
  eoa: `0x${string}`,
  chainId = POLYGON_CHAIN_ID
): Promise<SWCResult> {
  const rpcUrl = getRpcUrl(chainId);
  // const publicClient = createPublicClient({ transport: http(rpcUrl) });

  const bundlerUrl = createBundlerTransportUrl(chainId);

  const chain = chainId === POLYGON_CHAIN_ID ? polygon : mainnet;

  const publicClient = createPublicClient({ transport: http(rpcUrl), chain });

  const ownerClient = createWalletClient({
    account: eoa,
    chain,
    transport: custom((window as any).ethereum),
  });

  const ecdsaAccount = await toKernelSmartAccount({
    client: publicClient,
    owners: [ownerClient],
    entryPoint: DEFAULT_CONFIG.entryPoint,
  } as any);

  const pimlicoClient = createPimlicoClient({
    transport: http(bundlerUrl),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  const smartAccountClient = createSmartAccountClient({
    account: ecdsaAccount,
    chain,
    bundlerTransport: http(bundlerUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  // const ecdsaAccount = await toEcdsaKernelSmartAccount({
  //   client: publicClient,
  //   owners: [ownerClient],
  //   entryPoint: DEFAULT_CONFIG.entryPoint,
  //   accountAddress: eoa,
  // } as any);

  // const smartAccountClient = createSmartAccountClient({
  //   account: ecdsaAccount,
  //   publicClient,
  //   bundlerTransport: http(bundlerUrl),
  //   paymaster: {
  //     rpcUrl: bundlerUrl,
  //   },
  //   entryPoint: DEFAULT_CONFIG.entryPoint,
  //   chain,
  // } as any);

  const addressRecord = await upsertSWCAddress(userId, ecdsaAccount.address, 'metamask');
  const eoaRecord = await upsertEOAAddress(userId, eoa, 'metamask');

  return {
    smartAccount: smartAccountClient,
    swcAddress: ecdsaAccount.address,
    address: eoa,
    chainId,
    addressRecord,
    eoaAddress: eoa,
    eoaRecord,
    eoaAccount: ecdsaAccount,
  };
}
