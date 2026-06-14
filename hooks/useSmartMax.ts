import { useState, useCallback } from "react";
import { createPublicClient, custom, formatUnits, parseUnits } from "viem";
import { mainnet, polygon, base, bsc } from "viem/chains";

interface SmartMaxConfig {
    chainId: number;
    tokenAddress?: string;
    tokenDecimals: number;
    balance: string; // formatted balance
    isNativeToken: boolean;
}

interface SmartMaxCalculation {
    maxAmount: string;
    reservedGas: string;
    error: string | null;
}

interface SmartMaxResult {
    maxAmount: string;
    reservedGas: string;
    error: string | null;
    isCalculating: boolean;
    calculateSmartMax: () => Promise<SmartMaxCalculation>;
}

// Chain configurations
const CHAIN_CONFIGS = {
    1: { chain: mainnet, name: "Ethereum" },
    56: { chain: bsc, name: "BSC" },
    137: { chain: polygon, name: "Polygon" },
    8453: { chain: base, name: "Base" },
} as const;

// Safety buffer: 20% as per PRD
const SAFETY_BUFFER_MULTIPLIER = 1.2;

/**
 * Custom hook for "Smart Max" feature
 * Implements dynamic gas estimation with 20% safety buffer
 *
 * @see PRD: Fitur "Smart Max" Redeem
 */
export function useSmartMax(config: SmartMaxConfig): SmartMaxResult {
    const [maxAmount, setMaxAmount] = useState<string>("");
    const [reservedGas, setReservedGas] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const calculateSmartMax = useCallback(async (): Promise<SmartMaxCalculation> => {
        const { chainId, balance, isNativeToken, tokenDecimals } = config;

        // Reset states
        setError(null);
        setMaxAmount("");
        setReservedGas("");

        // Validation
        const balanceNum = parseFloat(balance);
        if (balanceNum <= 0) {
            const result = { maxAmount: "0", reservedGas: "", error: null };
            setMaxAmount("0");
            return result;
        }

        // Step 2 (PRD): Asset Checking
        // IF (Asset == ERC20_Token) -> Use 100% balance
        if (!isNativeToken) {
            const result = { maxAmount: balance, reservedGas: "", error: null };
            setMaxAmount(balance);
            return result;
        }

        // IF (Asset == Native_Coin) -> Continue with gas estimation
        setIsCalculating(true);

        try {
            // Step 3 (PRD): Fetch Network Data
            if (!window.ethereum) {
                throw new Error("MetaMask not detected");
            }

            const chainConfig = CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS];
            if (!chainConfig) {
                throw new Error(`Unsupported chain: ${chainId}`);
            }

            // Create public client for gas estimation
            const publicClient = createPublicClient({
                chain: chainConfig.chain,
                transport: custom(window.ethereum),
            });

            // Get current gas price (getFeeData equivalent in viem)
            const block = await publicClient.getBlock({ blockTag: "latest" });
            const gasPrice = await publicClient.getGasPrice();

            // Estimate gas for a simple native token transfer
            // Using a typical gas limit for ETH/MATIC/BNB transfer
            // This is a conservative estimate as actual redeem might use more gas
            const estimatedGasLimit = 21000n; // Standard transfer gas limit

            // For EIP-1559 chains, use base fee + priority fee
            let effectiveGasPrice = gasPrice;
            if (block.baseFeePerGas) {
                // Use base fee + 2 gwei priority fee (typical)
                const priorityFee = parseUnits("2", 9); // 2 gwei
                effectiveGasPrice = block.baseFeePerGas + priorityFee;
            }

            // Step 4 (PRD): Kalkulasi & Buffer
            // Estimated_Fee = GasLimit * GasPrice
            const estimatedFee = estimatedGasLimit * effectiveGasPrice;

            // Safe_Fee = Estimated_Fee * 1.2 (20% safety buffer)
            const safeFee = (estimatedFee * BigInt(Math.floor(SAFETY_BUFFER_MULTIPLIER * 100))) / 100n;

            // Convert to human-readable format
            const safeFeeFormatted = formatUnits(safeFee, tokenDecimals);
            const safeFeeNum = parseFloat(safeFeeFormatted);

            // Step 5 (PRD): Eksekusi Input
            // Final_Input_Value = Total_Balance - Safe_Fee
            const finalAmount = balanceNum - safeFeeNum;

            // Step D (PRD): Edge Case Handling
            // IF Total_Balance <= Safe_Fee
            if (finalAmount <= 0) {
                const result = {
                    maxAmount: "0",
                    reservedGas: "",
                    error: "Saldo terlalu rendah untuk menutupi biaya jaringan saat ini."
                };
                setMaxAmount("0");
                setError(result.error);
                return result;
            }

            const result = {
                maxAmount: finalAmount.toString(),
                reservedGas: safeFeeNum.toFixed(6),
                error: null
            };
            setMaxAmount(result.maxAmount);
            setReservedGas(result.reservedGas);
            return result;

        } catch (err) {
            console.error("[SmartMax] Calculation error:", err);

            // Fallback to conservative estimate if gas estimation fails
            // This prevents users from being stuck
            const fallbackReserve = balanceNum >= 0.01 ? 0.01 : balanceNum * 0.1;
            const fallbackAmount = balanceNum - fallbackReserve;

            if (fallbackAmount > 0) {
                const result = {
                    maxAmount: fallbackAmount.toString(),
                    reservedGas: fallbackReserve.toFixed(6),
                    error: "Menggunakan estimasi gas konservatif (gagal mengambil data real-time)."
                };
                setMaxAmount(result.maxAmount);
                setReservedGas(result.reservedGas);
                setError(result.error);
                return result;
            } else {
                const result = {
                    maxAmount: "0",
                    reservedGas: "",
                    error: "Saldo terlalu rendah untuk menutupi biaya jaringan."
                };
                setMaxAmount("0");
                setError(result.error);
                return result;
            }
        } finally {
            setIsCalculating(false);
        }
    }, [config]);

    return {
        maxAmount,
        reservedGas,
        error,
        isCalculating,
        calculateSmartMax,
    };
}
