"use client";

import { getMinAmountBuy } from "@/lib/constant";
import z from "zod";

// Helper functions for address validation
const isEvmAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isSolanaAddress = (address: string): boolean => {
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address) && !isEvmAddress(address);
};

const isBitcoinAddress = (address: string): boolean => {
    // Normalize
    const a = address.trim();

    // Legacy P2PKH — starts with "1" — Base58
    const p2pkh = /^1[1-9A-HJ-NP-Za-km-z]{25,34}$/;

    // Legacy P2SH — starts with "3" — Base58
    const p2sh = /^3[1-9A-HJ-NP-Za-km-z]{25,34}$/;

    // Bech32 SegWit — bc1q (lowercase only allowed)
    const bech32 = /^bc1q[ac-hj-np-z0-9]{11,71}$/;

    // Bech32m Taproot — bc1p (lowercase only allowed)
    const bech32m = /^bc1p[ac-hj-np-z0-9]{11,71}$/;

    return p2pkh.test(a) || p2sh.test(a) || bech32.test(a) || bech32m.test(a);
  };

// Create dynamic schema based on chainId, isConnected, and formActive
export const createTradingSchema = (
    chainId: number | undefined,
    isConnected: boolean,
    formActive: "onramp" | "offramp" = "onramp"
) => {
    // For onramp: validate minimum IDR amount per destination chain
    // (BTC and high-gas chains have higher bridge minimums).
    // For offramp: only validate it's a positive number (IDR minimum checked after quote)
    const minBuy = getMinAmountBuy(chainId);
    const amountSchema = formActive === "onramp"
        ? z
            .string()
            .min(1, "Amount is required")
            .refine(
                (val) => {
                    const numValue = parseFloat(
                        val.replace(/\./g, "").replace(/,/g, ".")
                    );
                    return !isNaN(numValue) && numValue >= minBuy;
                },
                {
                    message: `Minimum amount is IDR ${minBuy.toLocaleString("id-ID")}`,
                }
            )
        : z
            .string()
            .min(1, "Amount is required")
            .refine(
                (val) => {
                    // For offramp: input uses dot as decimal (e.g., "2.5")
                    const numValue = parseFloat(val);
                    return !isNaN(numValue) && numValue > 0;
                },
                {
                    message: "Amount must be greater than 0",
                }
            );

    return z.object({
        amount: amountSchema,
        destinationAddress: isConnected && formActive === "onramp"
            ? z
                .string()
                .min(1, "Destination address is required")
                .refine(
                    (val) => {
                        if (!val || val.trim() === "") {
                            return false;
                        }
                        if (chainId === 1151111081099710) {
                            return isSolanaAddress(val);
                        } else if (chainId === 20000000000001) {
                            return isBitcoinAddress(val);
                        } else {
                            return isEvmAddress(val);
                        }
                    },
                    {
                        message:
                            chainId === 1151111081099710
                                ? "Invalid Solana address format"
                                : chainId === 20000000000001
                                ? "Invalid Bitcoin address format"
                                : "Invalid destination address format",
                    }
                )
            : z.string().optional(),
        receivingAccount: formActive === "offramp" && isConnected
            ? z
                .string()
                .min(1, "Receiving account is required")
            : z.string().optional(),
    });
};

export type TradingFormData = z.infer<ReturnType<typeof createTradingSchema>>;
