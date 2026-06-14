export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 }).format(value);
