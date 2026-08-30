import { getSettingByName } from "@/services/settingsService";

export const formatAmountWithDecimals = async (
  amount: string | number,
  tokenInfo: any
): Promise<string> => {
  if (!tokenInfo) {
    const fallbackFormatted = (
      parseFloat(amount.toString()) * Math.pow(10, 18)
    ).toString();
    return fallbackFormatted;
  }

  const decimals = tokenInfo.decimals || 6;
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

  return integerResult;
};


export const getServiceFeePercentage = async (): Promise<number> => {
  try {
    const feeValue = await getSettingByName("service_fee");
    if (!feeValue?.value) {
      return 1.5;
    }

    const feePercentage = parseFloat(feeValue.value);

    if (isNaN(feePercentage)) {
      return 1.5;
    }

    return feePercentage;
  } catch (error) {
    return 1.5;
  }
};

export const isSolanaBridge = (quote: any): boolean => {
  const solanaChainIds = [501, "501", "solana", "SOL"]; // LI.FI uses 501 for Solana mainnet
  return (
    solanaChainIds.includes(String(quote?.action?.toToken?.chainId)) ||
    quote?.destination?.chainType === "solana"
  );
};

export const isBitcoinBridge = (quote: any): boolean => {
  const bitcoinChainIds = [
    20000000000001,
    "20000000000001",
    "bitcoin",
    "btc",
    "BTC",
  ];

  return (
    bitcoinChainIds.includes(String(quote?.action?.toToken?.chainId)) ||
    bitcoinChainIds.includes(String(quote?.toChainId)) ||
    quote?.destination?.chainType === "bitcoin"
  );
};


export const generateTxHashLink = (tx_hash: string, isSameChain?: boolean, isUserOperation?: boolean) => {
  const polygonScanUrl = "https://polygonscan.com";
  const lifiScanUrl = "https://scan.li.fi";
  if (isSameChain || isUserOperation) {
    return `${polygonScanUrl}/tx/${tx_hash}`;
  }
  return `${lifiScanUrl}/tx/${tx_hash}`;
}
