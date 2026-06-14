export const formatRp = (value: string) => {
  const numberString = value.replace(/[^,\d]/g, "");
  const parts = numberString.split(",");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
};

/**
 * Format token amount input (allows decimals with dot, no thousand separator)
 * Example: "2.5" for 2.5 tokens
 */
export const formatTokenInput = (value: string) => {
  // Only allow digits and dot (as decimal separator)
  let cleaned = value.replace(/[^\d.]/g, "");

  // Only allow one dot
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  return cleaned;
};
