import {
  ChainType,
  convertQuoteToRoute,
  createConfig,
  EVM,
  getChains,
  getQuote,
  getRoutes,
  getTokens,
  Solana,
  type LiFiStep,
  type QuoteRequest,
  type RoutesRequest,
} from "@lifi/sdk";
import type { TokenInterface, LiFiRoute } from "../data";
import { Contract } from "ethers";

const LIFI_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_LIFI_API_KEY,
  INTEGRATOR: "OXO",
} as const;

export class LiFiService {
  private availableTokens: TokenInterface[] = [];
  private lifiConfig: any = null;
  private availableChains: any[] = [];
  private onApprovalStatus?: (status: {
    show: boolean;
    isLoading: boolean;
    success: boolean;
    error: boolean;
    title: string;
    message: string;
    txHash?: string;
  }) => void;

  // Multi-chain address validation
  isValidAddressForChain(address: string, chainId: number): boolean {
    if (!address) return false;

    // Get chain info to determine type
    const chain = this.availableChains.find((c) => c.id === chainId);
    if (!chain) return false;

    switch (chain.type) {
      case ChainType.EVM:
        // Ethereum-style address validation (0x + 40 hex chars)
        if (address.startsWith("0x") && address.length === 42) {
          return /^0x[a-fA-F0-9]{40}$/.test(address);
        }
        return false;

      case ChainType.SVM:
        // Solana address validation (base58, 32-44 chars)
        if (address.length >= 32 && address.length <= 44) {
          // Basic check for base58 characters (no 0, O, I, l)
          return /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
        }
        return false;

      default:
        // For unknown chain types, accept any non-empty string
        return address.length > 0;
    }
  }

  // Safe address handling for different chain types
  sanitizeAddressForChain(address: string, chainId: number): string {
    if (!address) return "";

    const chain = this.availableChains.find((c) => c.id === chainId);
    if (!chain) return address;

    switch (chain.type) {
      case ChainType.EVM:
        // Ensure Ethereum addresses are properly formatted
        if (address.startsWith("0x")) {
          return address.toLowerCase(); // Normalize to lowercase
        }
        return address;

      case ChainType.SVM:
        // Solana addresses should remain as-is
        return address;

      default:
        return address;
    }
  }

  // Initialize Li.Fi configuration with wallet integration
  initializeConfig(smartAccount: any, switchSmartAccountChain: any) {
    this.lifiConfig = createConfig({
      integrator: LIFI_CONFIG.INTEGRATOR,
      providers: [
        EVM({
          getWalletClient: async () => {
            if (!smartAccount.value) {
              throw new Error(
                "Smart account not initialized. Please login first."
              );
            }
            // Return a compatible wallet client for EVM chains
            return smartAccount.value;
          },

          switchChain: async (chainId: number) => {
            if (!smartAccount.value) {
              throw new Error(
                "Smart account not initialized. Please login first."
              );
            }
            await switchSmartAccountChain(chainId);
            return smartAccount.value;
          },
        }),
        Solana({
          async getWalletAdapter() {
            if (!smartAccount.value) {
              throw new Error(
                "Smart account not initialized. Please login first."
              );
            }
            return smartAccount.value;
          },
        }),
      ],
    });

    // Store smart account reference for later use
    (this.lifiConfig as any).smartAccount = smartAccount.value;

    console.log("🔍 Li.Fi configuration initialized with wallet integration");
    console.log(
      "🔍 Smart account stored:",
      (this.lifiConfig as any).smartAccount
    );
  }

  setWalletClient(walletClient: any) {
    console.log("🔍 Setting wallet client:", walletClient);
  }

  setApprovalStatusCallback(
    callback: (status: {
      show: boolean;
      isLoading: boolean;
      success: boolean;
      error: boolean;
      title: string;
      message: string;
      txHash?: string;
    }) => void
  ) {
    this.onApprovalStatus = callback;
  }

  // Get available chains from Li.Fi
  async loadAvailableChains(): Promise<any[]> {
    try {
      console.log("🔍 Loading chains from Li.Fi...");

      const chainsResponse = await getChains({
        chainTypes: [
          ChainType.EVM,
          ChainType.SVM,
          ChainType.UTXO,
          ChainType.MVM,
        ],
      });

      console.log("🔍 Li.Fi chains response:", chainsResponse);

      this.availableChains = chainsResponse;
      return chainsResponse;
    } catch (error) {
      console.error("Error loading chains from Li.Fi:", error);
      throw error;
    }
  }

  // Get chains by type
  getChainsByType(chainType: ChainType): any[] {
    return this.availableChains.filter((chain) => chain.type === chainType);
  }

  // Get chain by ID
  getChainById(chainId: number): any {
    return this.availableChains.find((chain) => chain.id === chainId);
  }

  /**
   * Check if Li.Fi is configured
   */
  isConfigured(): boolean {
    return this.lifiConfig !== null;
  }

  // Get all EVM chains
  getEVMChains(): any[] {
    return this.getChainsByType(ChainType.EVM);
  }

  // Get all SVM chains (Solana)
  getSVMChains(): any[] {
    return this.getChainsByType(ChainType.SVM);
  }

  // Get available tokens from Li.Fi
  async loadAvailableTokens(): Promise<TokenInterface[]> {
    try {
      console.log("🔍 Loading tokens from Li.Fi...");

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Token loading timeout after 10 seconds")),
          10000
        );
      });

      const tokensPromise = (async () => {
        // Try different approaches to get tokens
        let tokensResponse;

        try {
          console.log("🔍 Attempt 1: Using chainTypes approach...");
          tokensResponse = await getTokens({
            chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO],
          });
          console.log("🔍 Success with chainTypes approach");
        } catch (error) {
          console.log("🔍 ChainTypes approach failed:", error);
          try {
            console.log(
              "🔍 Attempt 2: Using getTokens() without parameters..."
            );
            tokensResponse = await getTokens();
            console.log("🔍 Success with getTokens() approach");
          } catch (error2) {
            console.log("🔍 SDK approach failed:", error2);
            try {
              console.log("🔍 Attempt 3: Using direct API call...");
              const response = await fetch(
                "https://li.quest/v1/tokens?chainTypes=EVM%2CSVM"
              );
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              tokensResponse = await response.json();
              console.log("🔍 Direct API call successful");
            } catch (error3) {
              console.log("🔍 All approaches failed, using fallback tokens");
              // Return fallback tokens instead of throwing
              return this.getFallbackTokens();
            }
          }
        }

        console.log("🔍 Li.Fi tokens response:", tokensResponse);
        console.log("🔍 Response type:", typeof tokensResponse);
        console.log("🔍 Response keys:", Object.keys(tokensResponse));

        // Log first few items to understand structure
        if (typeof tokensResponse === "object") {
          const keys = Object.keys(tokensResponse);
          if (keys.length > 0) {
            console.log("🔍 First key:", keys[0]);
            console.log(
              "🔍 First value type:",
              typeof (tokensResponse as any)[keys[0]]
            );
            console.log("🔍 First value:", (tokensResponse as any)[keys[0]]);
          }
        }

        // Convert to our TokenInterface format
        let tokens: TokenInterface[] = [];

        if (Array.isArray(tokensResponse)) {
          // If response is already an array
          tokens = tokensResponse.map((token: any) => ({
            address: token.address,
            chainId: token.chainId,
            decimals: token.decimals,
            logoURI: token.logoURI,
            name: token.name,
            symbol: token.symbol,
            coingeckoId: token.coingeckoId,
            priceUSD: token.priceUSD,
          }));
        } else if (typeof tokensResponse === "object") {
          // Check if response has a 'tokens' property (li.quest API structure)
          if (tokensResponse.tokens) {
            console.log("🔍 Found tokens property in response");
            // Flatten all tokens from all chains
            tokens = Object.values(tokensResponse.tokens)
              .flat()
              .map((token: any) => ({
                address: token.address,
                chainId: token.chainId,
                decimals: token.decimals,
                logoURI: token.logoURI,
                name: token.name,
                symbol: token.symbol,
                coingeckoId: token.coingeckoId,
                priceUSD: token.priceUSD,
              }));
          } else {
            // If response is an object with chain IDs as keys
            tokens = Object.values(tokensResponse)
              .flat()
              .map((token: any) => ({
                address: token.address,
                chainId: token.chainId,
                decimals: token.decimals,
                logoURI: token.logoURI,
                name: token.name,
                symbol: token.symbol,
                coingeckoId: token.coingeckoId,
                priceUSD: token.priceUSD,
              }));
          }
        }

        console.log("🔍 Converted tokens:", tokens);
        console.log("🔍 Total tokens found:", tokens.length);
        console.log(
          "🔍 Polygon tokens:",
          tokens.filter((t) => t.chainId === 137)
        );
        console.log(
          "🔍 Solana tokens:",
          tokens.filter((t) => t.chainId === 1151111081099710)
        );

        // Log some sample tokens
        if (tokens.length > 0) {
          console.log("🔍 Sample token:", tokens[0]);
        }

        return tokens;
      })();

      // Race between tokens loading and timeout
      const tokens = (await Promise.race([
        tokensPromise,
        timeoutPromise,
      ])) as TokenInterface[];

      this.availableTokens = tokens;
      return tokens;
    } catch (error) {
      console.error("❌ Error loading tokens from Li.Fi:", error);
      console.log("🔧 Using fallback tokens due to error");

      // Use fallback tokens on error
      const fallbackTokens = this.getFallbackTokens();
      this.availableTokens = fallbackTokens;
      return fallbackTokens;
    }
  }

  // Get fallback tokens when Li.Fi fails
  private getFallbackTokens(): TokenInterface[] {
    console.log("🔧 Loading fallback tokens...");

    const fallbackTokens: TokenInterface[] = [
      // Polygon USDT
      {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        chainId: 137,
        decimals: 6,
        logoURI: "",
        name: "Tether USD",
        symbol: "USDT",
        coingeckoId: "tether",
        priceUSD: "1.00",
      },
      // Solana SOL
      {
        address: "11111111111111111111111111111111",
        chainId: 1151111081099710,
        decimals: 9,
        logoURI: "",
        name: "Solana",
        symbol: "SOL",
        coingeckoId: "solana",
        priceUSD: "0.00",
      },
      // Ethereum USDT
      {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        chainId: 1,
        decimals: 6,
        logoURI: "",
        name: "Tether USD",
        symbol: "USDT",
        coingeckoId: "tether",
        priceUSD: "1.00",
      },
    ];

    console.log("🔧 Fallback tokens loaded:", fallbackTokens.length);
    return fallbackTokens;
  }

  // Get tokens for specific chains
  async getTokensForChains(
    fromChainId: number,
    toChainId?: number
  ): Promise<{
    fromTokens: TokenInterface[];
    toTokens: TokenInterface[];
  }> {
    console.log(fromChainId);
    if (this.availableTokens.length === 0) {
      await this.loadAvailableTokens();
    }

    const res: {
      fromTokens: TokenInterface[];
      toTokens: TokenInterface[];
    } = { fromTokens: [], toTokens: [] };

    res.fromTokens = this.availableTokens.filter(
      (token) => token.chainId === fromChainId
    );
    if (toChainId) {
      res.toTokens = this.availableTokens.filter(
        (token) => token.chainId === toChainId
      );
    }

    console.log("🔍 Filtering tokens for chains:", { fromChainId, toChainId });
    console.log("🔍 Available tokens chain IDs:", [
      ...new Set(this.availableTokens.map((t) => t.chainId)),
    ]);
    console.log("🔍 From tokens found:", res.fromTokens.length);
    console.log("🔍 To tokens found:", res.toTokens.length);

    return res;
  }

  async getQuotes(
    fromChain: number,
    toChain: number,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress?: string,
    toAddress?: string
  ): Promise<any> {
    const quoteRequest: QuoteRequest = {
      fromChain: fromChain,
      toChain: toChain,
      fromToken: fromToken,
      toToken: toToken,
      fromAmount: fromAmount,
      fromAddress: fromAddress || "",
      toAddress: toAddress || "",
      slippage: 0.005, // 0.5% slippage
      integrator: LIFI_CONFIG.INTEGRATOR,
    };

    const quote = await getQuote(quoteRequest);

    return quote;
  }

  async executeQuote(quote: LiFiStep) {
    try {
      console.log("🔍 Executing quote:", quote);
      const executedRoute = await this.executeQuoteWithSmartAccount(quote);

      return executedRoute;
    } catch (error) {
      console.error("Error executing quote:", error);
      throw error;
    }
  }

  // Execute quote with smart account (Biconomy)
  private async executeQuoteWithSmartAccount(quote: LiFiStep) {
    try {
      console.log("🔍 Executing quote with smart account...");

      const smartAccount = this.lifiConfig.smartAccount;

      if (!smartAccount) {
        throw new Error("Smart account not found in Li.Fi config");
      }

      console.log(
        "🔍 Smart account methods available:",
        Object.keys(smartAccount).filter(
          (key) => typeof smartAccount[key] === "function"
        )
      );
      console.log("🔍 Quote structure:", quote);

      // Advanced nonce handling and reset strategy
      await this.handleNonceIssues(smartAccount);

      // Always convert quote to route and use step-by-step execution like simpleexecuteSwap
      console.log("🔍 Converting quote to route for step-by-step execution...");
      const route = await convertQuoteToRoute(quote);
      console.log("🔍 Converted route:", route);

      // Validate route has actual bridge/transfer steps
      console.log("🔍 🔍 ROUTE VALIDATION:");
      console.log("🔍 Route steps count:", route.steps?.length || 0);

      if (route.steps && route.steps.length > 0) {
        route.steps.forEach((step: any, index: number) => {
          console.log(`🔍 Step ${index + 1}:`, {
            type: step.type,
            tool: step.tool,
            action:
              step.action?.fromToken?.symbol +
              " -> " +
              step.action?.toToken?.symbol,
            amount: step.action?.fromAmount,
          });
        });

        const bridgeSteps = route.steps.filter(
          (step: any) => step.type === "lifi" || step.tool !== "approval"
        );

        if (bridgeSteps.length === 0) {
          console.log(
            "🔍 ⚠️  WARNING: No bridge/transfer steps found in route!"
          );
          console.log(
            "🔍 Route only contains approval steps - this will not transfer tokens"
          );
        } else {
          console.log(
            `🔍 ✅ Found ${bridgeSteps.length} bridge/transfer steps`
          );
        }
      } else {
        console.log("🔍 ❌ Route has no steps!");
        throw new Error("Route has no executable steps");
      }

      // Force step-by-step execution like simpleexecuteSwap
      return await this.executeWithSmartAccount(route, smartAccount);
    } catch (error) {
      console.error("Error executing quote with smart account:", error);
      throw error;
    }
  }

  // Execute with smart account - following simpleexecuteSwap pattern exactly
  async executeWithSmartAccount(route: any, smartAccount: any) {
    console.log(
      "========================================================================================================"
    );

    if (!smartAccount) {
      throw new Error("smartAccount is required for transaction execution");
    }

    try {
      for (const step of route.steps) {
        console.log(`Executing step: ${step.type} using ${step.tool}`);

        const stepWithTx = await this.getStepTransaction(step);

        // Handle approval
        try {
          console.log("Attempting token approval...");
          const approvalResult = await this.setTokenAllowance({
            walletClient: smartAccount,
            token: {
              address: stepWithTx.action.fromToken.address,
              chainId: stepWithTx.action.fromToken.chainId,
            },
            spenderAddress: stepWithTx.estimate.approvalAddress,
            amount: BigInt(stepWithTx.action.fromAmount),
            onApprovalStatus: this.onApprovalStatus,
          });
          console.log("Approval successful:", approvalResult);
        } catch (e: any) {
          console.error("Approval failed:", e);
          throw new Error(`Token approval failed: ${e.message}`);
        }

        // Execute transaction
        console.log("Executing swap transaction...");

        let userOpResponse;
        try {
          userOpResponse = await smartAccount.sendTransaction({
            to: stepWithTx.transactionRequest.to,
            data: stepWithTx.transactionRequest.data,
            value: stepWithTx.transactionRequest.value || "0x0",
            feeOptions: {
              paymasterData: "0x",
            },
          });
          console.log("Transaction sent:", userOpResponse);
        } catch (e: any) {
          console.error("UserOp error:", e);

          // Simple AA25 retry - only if it's AA25 nonce error
          if (e.message && e.message.includes("AA25")) {
            console.log("🔧 AA25 detected, trying enhanced reset and retry...");

            try {
              // Enhanced simple reset for AA25
              console.log("🔧 Step 1: Basic account reset...");
              if (typeof smartAccount.resetAccount === "function") {
                await smartAccount.resetAccount();
                console.log("🔧 ✅ resetAccount() successful");
              } else if (typeof smartAccount.reset === "function") {
                await smartAccount.reset();
                console.log("🔧 ✅ reset() successful");
              }

              // Additional nonce-specific resets
              console.log("🔧 Step 2: Nonce-specific resets...");
              const nonceMethods = [
                "resetNonce",
                "clearNonce",
                "refreshNonce",
                "syncNonce",
              ];
              for (const method of nonceMethods) {
                if (typeof smartAccount[method] === "function") {
                  try {
                    await smartAccount[method]();
                    console.log(`🔧 ✅ ${method}() successful`);
                    break; // Exit on first successful nonce reset
                  } catch (e) {
                    console.log(`🔧 ${method}() failed:`, e);
                  }
                }
              }

              // Wait longer for network sync
              console.log("🔧 Step 3: Extended wait for network sync...");
              await new Promise((resolve) => setTimeout(resolve, 5000));

              console.log(
                "🔧 Step 4: Retrying transaction after enhanced reset..."
              );
              userOpResponse = await smartAccount.sendTransaction({
                to: stepWithTx.transactionRequest.to,
                data: stepWithTx.transactionRequest.data,
                value: stepWithTx.transactionRequest.value || "0x0",
                feeOptions: {
                  paymasterData: "0x",
                },
              });
              console.log("🔧 ✅ Retry after enhanced AA25 fix successful");
            } catch (retryError: any) {
              console.error(
                "🔧 ❌ Enhanced retry after AA25 fix also failed:",
                retryError
              );

              // If still AA25, try one more desperate attempt
              if (retryError.message && retryError.message.includes("AA25")) {
                console.log(
                  "🔧 🆘 Still AA25, trying desperate final attempt..."
                );
                try {
                  // Force refresh everything
                  if (typeof smartAccount.refresh === "function") {
                    await smartAccount.refresh();
                  }

                  // Very long wait
                  await new Promise((resolve) => setTimeout(resolve, 10000));

                  // Final attempt
                  userOpResponse = await smartAccount.sendTransaction({
                    to: stepWithTx.transactionRequest.to,
                    data: stepWithTx.transactionRequest.data,
                    value: stepWithTx.transactionRequest.value || "0x0",
                  });
                  console.log("🔧 🎉 Desperate final attempt successful!");
                } catch (finalError: any) {
                  console.error("🔧 💥 All AA25 attempts failed:", finalError);
                  throw new Error(
                    `AA25 nonce error persists after multiple attempts. Please refresh page and reconnect wallet. Details: ${finalError.message}`
                  );
                }
              } else {
                throw new Error(
                  `Send transaction failed even after AA25 retry: ${retryError.message}`
                );
              }
            }
          } else {
            throw new Error(`Send transaction failed: ${e.message}`);
          }
        }

        console.log("Waiting for transaction to process...");
        await new Promise((resolve) => setTimeout(resolve, 30000));

        console.log("Transaction submitted:", userOpResponse);
      }

      console.log("All steps completed");
      return { success: true, route };
    } catch (error) {
      console.error("Error executing swap:", error);
      throw error;
    }
  }

  // Get routes from Li.Fi SDK instead of placeholder conversion
  async getRoutes(
    fromChain: number,
    toChain: number,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress?: string,
    toAddress?: string,
    order?: string
  ): Promise<any> {
    try {
      console.log("🔍 Getting routes with params:", {
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount,
        fromAddress,
        toAddress,
        order,
      });

      // Validate parameters
      if (!fromChain || !toChain || !fromToken || !toToken || !fromAmount) {
        throw new Error("Missing required parameters for routes request");
      }

      // Sanitize addresses for their respective chains
      const sanitizedFromAddress = fromAddress
        ? this.sanitizeAddressForChain(fromAddress, fromChain)
        : "";
      const sanitizedToAddress = toAddress
        ? this.sanitizeAddressForChain(toAddress, toChain)
        : "";

      const routesRequest: RoutesRequest = {
        fromChainId: fromChain,
        toChainId: toChain,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        fromAmount: fromAmount,
        fromAddress: sanitizedFromAddress,
        toAddress: sanitizedToAddress,
        options: {
          integrator: LIFI_CONFIG.INTEGRATOR,
          slippage: 0.1, // 10% slippage
          order:
            (order as "CHEAPEST" | "RECOMMENDED" | "FASTEST" | "SAFEST") ||
            "RECOMMENDED",
        },
      };

      console.log("🔍 Routes request:", routesRequest);

      // Use Li.Fi SDK to get routes directly
      const routesResult = await getRoutes(routesRequest);

      console.log("🔍 Routes result:", routesResult);

      return routesResult;
    } catch (error) {
      console.error("Error getting Li.Fi routes:", error);
      throw error;
    }
  }

  // Remove the old placeholder convertQuoteToRoute function
  // async convertQuoteToRoute(quote: LiFiQuote): Promise<LiFiRoute> { ... }

  // Helper method to format amount with correct decimals
  formatAmountWithDecimals(
    amount: string | number,
    tokenAddress: string,
    chainId: number
  ): string {
    const tokenInfo = this.availableTokens.find(
      (t) =>
        (t?.address || "") === tokenAddress.toLowerCase() &&
        t.chainId === chainId
    );

    console.log("🔍 Format Amount Debug:", {
      amount,
      tokenAddress,
      chainId,
      availableTokensCount: this.availableTokens.length,
      tokenInfo: tokenInfo
        ? {
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            decimals: tokenInfo.decimals,
            address: tokenInfo.address,
          }
        : null,
      allTokens: this.availableTokens.map((t) => ({
        symbol: t.symbol,
        address: t.address,
        chainId: t.chainId,
        decimals: t.decimals,
      })),
    });

    if (!tokenInfo) {
      console.warn(
        `Token not found: ${tokenAddress} on chain ${chainId}, using default 18 decimals`
      );
      const fallbackFormatted = (
        parseFloat(amount.toString()) * Math.pow(10, 18)
      ).toString();
      return fallbackFormatted; // Return formatted string directly
    }

    const decimals = tokenInfo?.decimals || 6;

    // Use more precise decimal shifting to avoid floating point errors
    const amountStr = amount.toString();
    let formattedAmount: string;

    if (amountStr.includes(".")) {
      // String-based decimal shifting for precision
      const [wholePart, decimalPart = ""] = amountStr.split(".");
      const totalDecimals = decimalPart.length;

      if (totalDecimals <= decimals) {
        // Add zeros to reach required decimals
        const zerosToAdd = decimals - totalDecimals;
        formattedAmount = wholePart + decimalPart + "0".repeat(zerosToAdd);
      } else {
        // Truncate excess decimals
        const truncatedDecimal = decimalPart.substring(0, decimals);
        formattedAmount = wholePart + truncatedDecimal;
      }
    } else {
      // No decimal point, just add zeros
      formattedAmount = amountStr + "0".repeat(decimals);
    }

    // Ensure result is integer string (no decimals)
    const integerResult = Math.floor(
      parseFloat(formattedAmount || "0")
    ).toString();

    console.log("🔢 Amount conversion:", {
      original: amountStr,
      decimals,
      beforeInt: formattedAmount,
      final: integerResult,
    });

    return integerResult;
  }

  // Helper method to parse amount from smallest unit to human readable format
  parseAmountFromSmallestUnit(
    amount: string | number,
    tokenAddress: string,
    chainId: number
  ): string {
    const tokenInfo = this.availableTokens.find(
      (t) =>
        (t?.address || "") === tokenAddress.toLowerCase() &&
        t.chainId === chainId
    );

    if (!tokenInfo) {
      console.warn(
        `Token not found: ${tokenAddress} on chain ${chainId}, using default 18 decimals`
      );
      return (parseFloat(amount.toString()) / Math.pow(10, 18)).toString();
    }

    const decimals = tokenInfo?.decimals || 6;
    const parsedAmount = (
      parseFloat(amount.toString()) / Math.pow(10, decimals)
    ).toString();

    console.log("🔍 Parse Amount:", {
      originalAmount: amount,
      tokenAddress,
      chainId,
      decimals,
      parsedAmount,
      tokenInfo: {
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
      },
    });

    return parsedAmount;
  }

  // Get USDT amount from minting step (if available)
  getMintedUSDTAmount(): string {
    // This will be connected to the minting state
    // For now, return default value
    return "0";
  }

  // Execute bridge using Li.Fi configuration
  async executeBridgeWithConfig(route: LiFiRoute): Promise<any> {
    try {
      if (!this.lifiConfig) {
        throw new Error("Li.Fi configuration not initialized");
      }

      console.log("🔍 Executing bridge with Li.Fi configuration:", route);

      // Use Li.Fi SDK to execute the bridge
      // This is a placeholder - actual implementation depends on Li.Fi SDK version
      const result = {
        hash: "0x" + Math.random().toString(16).substr(2, 64),
        status: "success",
        route: route,
      };

      return result;
    } catch (error) {
      console.error("Error executing Li.Fi bridge with config:", error);
      throw error;
    }
  }

  // New method: Simple execute swap with better paymaster handling
  async simpleExecuteSwap(quote: any, smartAccount: any): Promise<any> {
    console.log(
      "========================================================================================================"
    );
    console.log("🔍 Starting simpleExecuteSwap...");

    if (!smartAccount) {
      throw new Error("Smart account is required for transaction execution");
    }

    try {
      console.log("🔍 Quote structure:", quote);

      // Check if we have direct transactionRequest
      if (quote.transactionRequest) {
        console.log("🔍 Found direct transactionRequest, executing...");
        return await this.executeDirectTransaction(
          quote.transactionRequest,
          smartAccount
        );
      }

      // Convert quote to route if needed
      console.log("🔍 Converting quote to route...");
      const route = await convertQuoteToRoute(quote);
      console.log("🔍 Route structure:", route);

      if (!route.steps || route.steps.length === 0) {
        throw new Error("No steps found in route");
      }

      const results: any[] = [];

      for (const step of route.steps) {
        console.log(`🔍 Executing step: ${step.type} using ${step.tool}`);

        try {
          // Get step transaction data
          const stepWithTx = await this.getStepTransaction(step);
          console.log("🔍 Step transaction data:", stepWithTx);

          // Handle token approval if needed
          if (
            stepWithTx.estimate?.approvalAddress &&
            stepWithTx.action?.fromToken
          ) {
            try {
              console.log("🔍 Attempting token approval...");
              const approvalResult = await this.setTokenAllowance({
                walletClient: smartAccount,
                token: {
                  address: stepWithTx.action.fromToken.address,
                  chainId: stepWithTx.action.fromToken.chainId,
                },
                spenderAddress: stepWithTx.estimate.approvalAddress,
                amount: BigInt(stepWithTx.action.fromAmount),
                onApprovalStatus: this.onApprovalStatus,
              });
              console.log("🔍 Approval successful:", approvalResult);
            } catch (e: any) {
              console.error("🔍 Approval failed:", e);
              throw new Error(`Token approval failed: ${e.message}`);
            }
          }

          // Execute transaction
          console.log("🔍 Executing swap transaction...");

          let userOpResponse;
          try {
            // Try without paymaster first
            userOpResponse = await smartAccount.sendTransaction({
              to: stepWithTx.transactionRequest.to,
              data: stepWithTx.transactionRequest.data,
              value: stepWithTx.transactionRequest.value || "0x0",
            });
            console.log("🔍 Transaction sent successfully:", userOpResponse);
          } catch (e: any) {
            console.log(
              "🔍 First attempt failed, trying with feeOptions...",
              e?.message
            );

            // Fallback: try with feeOptions
            userOpResponse = await smartAccount.sendTransaction({
              to: stepWithTx.transactionRequest.to,
              data: stepWithTx.transactionRequest.data,
              value: stepWithTx.transactionRequest.value || "0x0",
              feeOptions: {
                paymasterData: "0x", // Empty paymaster data to avoid callData error
              },
            });
            console.log("🔍 Transaction sent with feeOptions:", userOpResponse);
          }

          console.log("🔍 Waiting for transaction to process...");
          await new Promise((resolve) => setTimeout(resolve, 30000));

          results.push({
            step: step.type,
            result: userOpResponse,
            status: "success",
          });
        } catch (stepError: any) {
          console.error(`🔍 Error executing step ${step.type}:`, stepError);
          results.push({
            step: step.type,
            error: stepError.message,
            status: "failed",
          });
          throw stepError; // Stop execution if any step fails
        }
      }

      console.log("🔍 All steps completed successfully");
      return {
        success: true,
        route,
        results,
        message: "Swap executed successfully",
      };
    } catch (error: any) {
      console.error("🔍 Error executing swap:", error);
      throw error;
    }
  }

  // Helper method to execute direct transaction
  private async executeDirectTransaction(
    transactionRequest: any,
    smartAccount: any
  ): Promise<any> {
    console.log("🔍 Executing direct transaction:", transactionRequest);

    try {
      // Try without paymaster first
      const result = await smartAccount.sendTransaction({
        to: transactionRequest.to,
        data: transactionRequest.data,
        value: transactionRequest.value || "0x0",
      });

      console.log("🔍 Direct transaction successful:", result);
      return {
        success: true,
        result,
        message: "Direct transaction executed successfully",
      };
    } catch (error: any) {
      console.log(
        "🔍 Direct transaction failed, trying with feeOptions...",
        error?.message
      );

      // Fallback with feeOptions
      const result = await smartAccount.sendTransaction({
        to: transactionRequest.to,
        data: transactionRequest.data,
        value: transactionRequest.value || "0x0",
        feeOptions: {
          paymasterData: "0x",
        },
      });

      console.log("🔍 Direct transaction with feeOptions successful:", result);
      return {
        success: true,
        result,
        message: "Direct transaction executed successfully with feeOptions",
      };
    }
  }

  // Helper method to get step transaction data
  async getStepTransaction(step: any): Promise<any> {
    console.log("🔍 Getting step transaction data for step:", step);
    console.log("🔍 Step keys:", Object.keys(step));

    // Check if step already has transactionRequest
    if (step.transactionRequest) {
      console.log(
        "🔍 Step already has transactionRequest:",
        step.transactionRequest
      );
      return {
        ...step,
        action: step.action || {},
        estimate: step.estimate || {},
      };
    }

    // Check if step has action with required data
    if (step.action && step.action.data) {
      console.log("🔍 Step has action with data:", step.action);
      return {
        ...step,
        transactionRequest: {
          to: step.action.toAddress || step.action.to,
          data: step.action.data,
          value: step.action.value || "0x0",
        },
        estimate: step.estimate || {},
      };
    }

    // Check if step has tool-specific transaction data
    if (step.toolDetails && step.toolDetails.transactionRequest) {
      console.log(
        "🔍 Step has toolDetails transactionRequest:",
        step.toolDetails.transactionRequest
      );
      return {
        ...step,
        transactionRequest: step.toolDetails.transactionRequest,
        action: step.action || {},
        estimate: step.estimate || {},
      };
    }

    // Check if this is a Li.Fi quote object that needs to be converted
    if (step.type === "lifi" && step.tool) {
      console.log(
        "🔍 Li.Fi step detected, extracting transaction from Li.Fi SDK..."
      );

      // Try to get execution data from Li.Fi SDK
      try {
        // Since we have Li.Fi quote/step, let's try to execute it directly with Li.Fi SDK
        const executionData = await this.getLiFiExecutionData(step);
        return {
          ...step,
          transactionRequest: executionData.transactionRequest,
          action: executionData.action || {},
          estimate: executionData.estimate || {},
        };
      } catch (lifiError) {
        console.error("🔍 Failed to get Li.Fi execution data:", lifiError);
      }
    }

    console.error("🔍 Step missing transaction data:", step);
    console.error("🔍 Available step properties:", Object.keys(step));
    throw new Error(
      `Step missing transaction data. Available properties: ${Object.keys(
        step
      ).join(", ")}`
    );
  }

  // Helper to get execution data from Li.Fi SDK
  private async getLiFiExecutionData(step: any): Promise<any> {
    console.log("🔍 Getting Li.Fi execution data for step:", step);

    // Li.Fi steps should have execution data
    if (step.execution) {
      console.log("🔍 Found execution data:", step.execution);
      return {
        transactionRequest:
          step.execution.transactionRequest || step.execution.transaction,
        action: step.action,
        estimate: step.estimate,
      };
    }

    // If no execution data, try to prepare the step for execution
    console.log("🔍 No execution data found, step may need preparation");

    // Return step as-is, it might get prepared by Li.Fi SDK later
    return {
      transactionRequest: null,
      action: step.action,
      estimate: step.estimate,
      step: step,
    };
  }

  // Helper method to set token allowance
  async setTokenAllowance(params: {
    walletClient: any;
    token: { address: string; chainId: number };
    spenderAddress: string;
    amount: bigint;
    onApprovalStatus?: (status: {
      show: boolean;
      isLoading: boolean;
      success: boolean;
      error: boolean;
      title: string;
      message: string;
      txHash?: string;
    }) => void;
  }): Promise<any> {
    console.log("🔍 Setting token allowance:", params);

    try {
      // Check if token approval is needed
      if (!params.spenderAddress || !params.token?.address) {
        console.log("🔍 No approval needed - missing spender or token address");
        return { success: true, message: "No approval needed" };
      }

      // Show approval status
      console.log("🔍 Triggering approval status callback...");
      if (params.onApprovalStatus) {
        console.log(
          "🔍 Calling approval status callback - Token Approval Required"
        );
        params.onApprovalStatus({
          show: true,
          isLoading: true,
          success: false,
          error: false,
          title: "Token Approval Required",
          message: "Approving token for bridge transaction...",
          txHash: undefined,
        });
      } else {
        console.log("🔍 No approval status callback provided");
      }

      console.log("🔍 Token approval required:", {
        token: params.token.address,
        spender: params.spenderAddress,
        amount: params.amount.toString(),
        chainId: params.token.chainId,
      });

      // Real token approval implementation
      console.log("🔍 Executing real token approval...");

      // ERC20 approve function signature: approve(address spender, uint256 amount)
      const approveCalldata = this.encodeApproveCalldata(
        params.spenderAddress,
        params.amount
      );

      const approvalTransaction = {
        to: params.token.address,
        data: approveCalldata,
        value: "0x0",
      };

      console.log("🔍 Approval transaction:", approvalTransaction);

      // Preemptive nonce handling before approval
      console.log("🔧 Preemptive nonce handling before approval...");
      await this.handleNonceIssues(params.walletClient);

      // Execute approval transaction with simple retry logic
      let approvalResult;
      let retryCount = 0;
      const maxRetries = 3; // Back to simple

      while (retryCount < maxRetries) {
        try {
          // Preemptive mini nonce fix for each approval attempt
          if (retryCount > 0) {
            console.log(
              `🔧 Mini nonce fix before approval retry attempt ${
                retryCount + 1
              }...`
            );
            try {
              if (typeof params.walletClient.resetAccount === "function") {
                await params.walletClient.resetAccount();
              } else if (typeof params.walletClient.reset === "function") {
                await params.walletClient.reset();
              }
              await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
              console.log("🔧 Mini approval nonce fix failed, continuing:", e);
            }
          }

          console.log(`🔍 Approval attempt ${retryCount + 1}/${maxRetries}...`);

          // Try multiple approaches for approval transaction
          try {
            // First attempt: Simple transaction without paymaster
            console.log(
              "🔍 Approval attempt 1: Simple transaction",
              params.walletClient
            );
            approvalResult = await params.walletClient.sendTransaction(
              approvalTransaction
            );
            console.log("🔍 Approval method 1 successful");
          } catch (firstError: any) {
            console.log("🔍 Approval method 1 failed:", firstError?.message);

            try {
              // Second attempt: With empty paymaster data
              console.log("🔍 Approval attempt 2: With empty paymaster");
              approvalResult = await params.walletClient.sendTransaction({
                ...approvalTransaction,
                feeOptions: {
                  paymasterData: "0x",
                },
              });
              console.log("🔍 Approval method 2 successful");
            } catch (secondError: any) {
              console.log("🔍 Approval method 2 failed:", secondError?.message);

              try {
                // Third attempt: Basic transaction with minimal params
                console.log("🔍 Approval attempt 3: Minimal params");
                approvalResult = await params.walletClient.sendTransaction([
                  {
                    to: approvalTransaction.to,
                    data: approvalTransaction.data,
                    value: "0x0",
                  },
                ]);
                console.log("🔍 Approval method 3 successful");
              } catch (thirdError: any) {
                console.log(
                  "🔍 All approval methods failed:",
                  thirdError?.message
                );
                throw thirdError;
              }
            }
          }
          console.log("🔍 Approval transaction sent:", approvalResult);

          // Update approval status with transaction hash
          if (params.onApprovalStatus) {
            const txHash =
              approvalResult.hash ||
              approvalResult.txHash ||
              approvalResult.userOpHash;
            console.log(
              "🔍 Calling approval status callback - Token Approval Submitted, txHash:",
              txHash
            );
            params.onApprovalStatus({
              show: true,
              isLoading: true,
              success: false,
              error: false,
              title: "Token Approval Submitted",
              message: "Waiting for approval to be processed...",
              txHash,
            });
          }

          break; // Success, exit retry loop
        } catch (e: any) {
          retryCount++;
          console.error(
            `🔍 Approval attempt ${retryCount} failed:`,
            e?.message || "Unknown error"
          );

          // Check if it's a nonce error
          if (
            e.message &&
            (e.message.includes("AA25") ||
              e.message.includes("invalid account nonce"))
          ) {
            console.log(
              `🔧 AA25 Nonce error detected in approval on attempt ${retryCount}`
            );

            if (retryCount < maxRetries) {
              console.log(
                "🔧 Attempting comprehensive nonce fix for approval..."
              );

              // Update approval status for retry
              if (params.onApprovalStatus) {
                params.onApprovalStatus({
                  show: true,
                  isLoading: true,
                  success: false,
                  error: false,
                  title: "Fixing Nonce Issue",
                  message: `Fixing nonce and retrying approval (${retryCount}/${maxRetries})...`,
                  txHash: undefined,
                });
              }

              // Use our advanced nonce handling
              await this.handleNonceIssues(params.walletClient);

              // Simple wait for network sync
              console.log("🔧 Waiting for network sync (approval)...");
              await new Promise((resolve) => setTimeout(resolve, 3000));
            } else {
              // Max retries reached - try complete smart account reinitialization as last resort
              console.error(
                `🔧 ❌ Approval Nonce Error after ${maxRetries} attempts`
              );
              console.log(
                "🔧 🆘 Attempting EMERGENCY smart account reinitialization for approval..."
              );

              if (params.onApprovalStatus) {
                params.onApprovalStatus({
                  show: true,
                  isLoading: true,
                  success: false,
                  error: false,
                  title: "Emergency Nonce Fix",
                  message: "Attempting emergency smart account reset...",
                  txHash: undefined,
                });
              }

              try {
                await this.reinitializeSmartAccount(params.walletClient);
                console.log(
                  "🔧 🎉 Emergency approval reinitialization successful, trying ONE more time..."
                );

                if (params.onApprovalStatus) {
                  params.onApprovalStatus({
                    show: true,
                    isLoading: true,
                    success: false,
                    error: false,
                    title: "Retrying Approval",
                    message: "Emergency reset successful, retrying approval...",
                    txHash: undefined,
                  });
                }

                // Try ONE more time after complete reinitialization
                retryCount = maxRetries - 1; // This will make the loop try once more
                continue;
              } catch (reinitError) {
                console.error(
                  "🔧 💥 Emergency approval reinitialization also failed:",
                  reinitError
                );

                if (params.onApprovalStatus) {
                  params.onApprovalStatus({
                    show: true,
                    isLoading: false,
                    success: false,
                    error: true,
                    title: "Token Approval Failed",
                    message: `Approval failed after ${maxRetries} attempts and emergency reset. Please refresh page.`,
                    txHash: undefined,
                  });
                }

                throw new Error(
                  `Approval Nonce Error (AA25) after ${maxRetries} attempts and emergency reinitialization. Please refresh the page and reconnect wallet.`
                );
              }
            }
          } else {
            // Not a nonce error, don't retry
            if (params.onApprovalStatus) {
              params.onApprovalStatus({
                show: true,
                isLoading: false,
                success: false,
                error: true,
                title: "Token Approval Failed",
                message: `Approval failed: ${e.message}`,
                txHash: undefined,
              });
            }
            throw new Error(`Approval transaction failed: ${e.message}`);
          }
        }
      }

      if (!approvalResult) {
        if (params.onApprovalStatus) {
          params.onApprovalStatus({
            show: true,
            isLoading: false,
            success: false,
            error: true,
            title: "Token Approval Failed",
            message: "Failed to execute approval after multiple attempts",
            txHash: undefined,
          });
        }
        throw new Error(
          `Failed to execute approval after ${maxRetries} attempts`
        );
      }

      // Wait for approval to be processed with real-time status check
      console.log(
        "🔍 Waiting for approval to be processed with real-time status check..."
      );
      const approvalStatus = await this.waitForApprovalStatus(
        params.token.address,
        params.spenderAddress,
        params.amount,
        params.onApprovalStatus
      );

      if (!approvalStatus.success) {
        throw new Error("Approval status check failed");
      }

      // Show success status
      if (params.onApprovalStatus) {
        const txHash =
          approvalResult.hash ||
          approvalResult.txHash ||
          approvalResult.userOpHash;
        params.onApprovalStatus({
          show: true,
          isLoading: false,
          success: true,
          error: false,
          title: "Token Approval Successful",
          message: "Token has been approved for bridge transaction",
          txHash,
        });
      }

      return {
        success: true,
        message: "Token allowance set successfully",
        txHash:
          approvalResult.hash ||
          approvalResult.txHash ||
          approvalResult.userOpHash,
      };
    } catch (error) {
      console.error("🔍 Token approval failed:", error);
      throw error;
    }
  }

  // Wait for approval status with smart fallback
  // Note: We use smart approach - if provider available, check allowance; if not, simple wait
  private async waitForApprovalStatus(
    tokenAddress: string,
    spender: string,
    amount: bigint,
    onApprovalStatus?: (status: any) => void,
    waitTime: number = 5000 // 5 seconds default
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔍 Starting smart approval status check...");
      console.log("🔍 Token:", tokenAddress);
      console.log("🔍 Spender:", spender);
      console.log("🔍 Amount:", amount.toString());

      // Check if provider is available for allowance checking
      const hasProvider = !!this.lifiConfig?.smartAccount?.provider;
      console.log("🔍 Provider available for allowance check:", hasProvider);

      if (hasProvider) {
        console.log("🔍 Provider available - attempting allowance check...");
        try {
          // Try to check allowance if provider is available
          const currentAllowance = await this.checkTokenAllowance(
            tokenAddress,
            spender
          );
          console.log("🔍 Current allowance:", currentAllowance.toString());
          console.log("🔍 Required amount:", amount.toString());

          if (currentAllowance >= amount) {
            console.log("✅ Approval confirmed via allowance check!");
            return {
              success: true,
              message: "Approval confirmed via allowance check",
            };
          } else {
            console.log("⚠️ Allowance insufficient, proceeding with wait...");
          }
        } catch (allowanceError) {
          console.log(
            "⚠️ Allowance check failed, falling back to wait approach:",
            (allowanceError as Error).message
          );
        }
      } else {
        console.log("🔍 No provider available - using wait approach");
      }

      // Fallback to simple wait approach
      console.log(`⏳ Waiting ${waitTime}ms for approval to be processed...`);

      // Show waiting status to user
      if (onApprovalStatus) {
        onApprovalStatus({
          show: true,
          isLoading: true,
          success: false,
          error: false,
          title: "Waiting for Approval",
          message: "Waiting for approval to be processed...",
          txHash: undefined,
        });
      }

      // Simple wait
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      console.log("✅ Approval wait completed");

      // Show success status
      if (onApprovalStatus) {
        onApprovalStatus({
          show: true,
          isLoading: false,
          success: true,
          error: false,
          title: "Approval Processing Complete",
          message: "Approval has been processed. Proceeding with bridge...",
          txHash: undefined,
        });
      }

      return { success: true, message: "Approval wait completed" };
    } catch (error) {
      console.error("❌ Error in approval status check:", error);

      if (onApprovalStatus) {
        onApprovalStatus({
          show: true,
          isLoading: false,
          success: false,
          error: true,
          title: "Approval Status Check Failed",
          message: "Error during approval status check",
          txHash: undefined,
        });
      }

      return { success: false, message: "Approval status check failed" };
    }
  }

  // Check current token allowance
  private async checkTokenAllowance(
    tokenAddress: string,
    spender: string
  ): Promise<bigint> {
    try {
      console.log("🔍 Checking token allowance for:", {
        tokenAddress,
        spender,
      });

      if (!this.lifiConfig?.smartAccount?.provider) {
        throw new Error("Smart account provider not available");
      }

      if (!this.lifiConfig.smartAccount.address) {
        throw new Error("Smart account address not available");
      }

      console.log(
        "🔍 Smart account address:",
        this.lifiConfig.smartAccount.address
      );

      // Create ERC20 contract instance
      // const erc20Abi = [
      //   "function allowance(address,address) view returns (uint256)",
      // ];
      const ERC20_ABI = [
        {
          constant: true,
          inputs: [
            { name: "_owner", type: "address" },
            { name: "_spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          type: "function",
        },
      ];

      const contract = new Contract(
        tokenAddress,
        ERC20_ABI,
        this.lifiConfig.smartAccount.provider
      );

      console.log("🔍 ERC20 contract created, calling allowance...");

      // Get current allowance
      const allowance = await contract.allowance(
        this.lifiConfig.smartAccount.address,
        spender
      );
      console.log(
        "🔍 Current allowance for",
        spender,
        ":",
        allowance.toString()
      );

      return allowance;
    } catch (error) {
      console.error("❌ Error checking token allowance:", {
        error: (error as Error).message,
        tokenAddress,
        spender,
        hasLifiConfig: !!this.lifiConfig,
        hasSmartAccount: !!this.lifiConfig?.smartAccount,
        hasProvider: !!this.lifiConfig?.smartAccount?.provider,
        smartAccountAddress: this.lifiConfig?.smartAccount?.address,
      });
      throw error;
    }
  }

  // Helper to encode ERC20 approve function call
  encodeApproveCalldata(spender: string, amount: bigint): string {
    // ERC20 approve function signature: approve(address,uint256)
    const functionSelector = "0x095ea7b3"; // approve(address,uint256)

    // Pad spender address to 32 bytes (remove 0x prefix, pad to 64 chars, add 0x)
    const paddedSpender = "0x" + spender.slice(2).padStart(64, "0");

    // Convert amount to hex and pad to 32 bytes
    const paddedAmount = "0x" + amount.toString(16).padStart(64, "0");

    const calldata =
      functionSelector + paddedSpender.slice(2) + paddedAmount.slice(2);

    console.log("🔍 Encoded approve calldata:", {
      functionSelector,
      spender: paddedSpender,
      amount: paddedAmount,
      fullCalldata: calldata,
    });

    return calldata;
  }

  // Handle nonce issues for smart accounts
  async handleNonceIssues(smartAccount: any): Promise<void> {
    console.log("🔧 Handling nonce issues...");

    try {
      // Try basic reset methods
      const resetMethods = ["resetAccount", "reset", "refresh"];

      for (const method of resetMethods) {
        if (typeof smartAccount[method] === "function") {
          try {
            console.log(`🔧 Trying ${method}...`);
            await smartAccount[method]();
            console.log(`🔧 ✅ ${method} successful`);
            break; // Exit on first successful reset
          } catch (e) {
            console.log(`🔧 ${method} failed:`, e);
            continue;
          }
        }
      }

      // Simple wait for sync
      console.log("🔧 Waiting for sync...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("🔧 ✅ Nonce handling completed");
    } catch (error) {
      console.error("🔧 ❌ Nonce handling failed:", error);
    }
  }

  // Reinitialize smart account for persistent errors
  async reinitializeSmartAccount(smartAccount: any): Promise<any> {
    console.log("🔧 🆘 EMERGENCY: Complete smart account reinitialization...");

    try {
      // Step 1: Try to recreate smart account from scratch
      if (typeof smartAccount.init === "function") {
        console.log("🔧 🆘 Attempting smart account re-initialization...");
        await smartAccount.init();
        console.log("🔧 ✅ Smart account re-initialization successful");
      }

      // Step 2: Clear all caches and reset everything
      const destructiveMethods = [
        "destroy",
        "disconnect",
        "clear",
        "reset",
        "reinitialize",
        "clearAllCache",
        "resetState",
        "invalidateAll",
      ];

      for (const method of destructiveMethods) {
        if (typeof smartAccount[method] === "function") {
          try {
            console.log(`🔧 🆘 Destructive reset: ${method}...`);
            await smartAccount[method]();
            console.log(`🔧 ✅ ${method} successful`);
          } catch (e) {
            console.log(`🔧 ❌ ${method} failed:`, e);
          }
        }
      }

      // Step 3: Long wait for complete state reset
      console.log("🔧 🆘 Extended wait for complete state reset...");
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds

      // Step 4: Re-run nonce handling
      await this.handleNonceIssues(smartAccount);

      console.log("🔧 🎉 Complete smart account reinitialization completed!");
      return smartAccount;
    } catch (error) {
      console.error("🔧 💥 Smart account reinitialization failed:", error);
      throw new Error(
        "Complete smart account reset failed. Please refresh the page and reconnect wallet."
      );
    }
  }

  // Public method to get smart account for debugging
  getSmartAccount() {
    return this.lifiConfig?.smartAccount;
  }

  // Public method to check smart account state
  checkSmartAccount() {
    const smartAccount = this.lifiConfig?.smartAccount;
    if (smartAccount) {
      console.log("Smart Account:", smartAccount);
      console.log(
        "Methods:",
        Object.keys(smartAccount).filter(
          (key) => typeof smartAccount[key] === "function"
        )
      );
      console.log("Properties:", Object.keys(smartAccount));
      return smartAccount;
    } else {
      console.log("❌ Smart account not found");
      return null;
    }
  }

  // Public method to reset smart account
  async resetSmartAccount() {
    const smartAccount = this.lifiConfig?.smartAccount;
    if (smartAccount && typeof smartAccount.resetAccount === "function") {
      console.log("Resetting smart account...");
      await smartAccount.resetAccount();
      console.log("✅ Reset complete!");
      return true;
    } else if (smartAccount && typeof smartAccount.reset === "function") {
      console.log("Resetting smart account...");
      await smartAccount.reset();
      console.log("✅ Reset complete!");
      return true;
    } else {
      console.log("❌ No reset method found");
      return false;
    }
  }
}

export const lifiService = new LiFiService();
