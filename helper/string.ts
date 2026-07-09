export const generateRandomString = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
};

export const textWithCenterEllipsis = (
  text: string,
  maxLengthStart: number,
  maxLengthEnd?: number
) => {
  if (text?.length <= maxLengthStart + 3) return text;
  const maxEnd = maxLengthEnd || maxLengthStart;

  return `${text?.slice(0, maxLengthStart)}...${text?.slice(-maxEnd)}`;
};

export const textWithStartEllipsis = (
  text: string,
  maxLength: number = 10
) => {
  if (!text || text.length <= maxLength + 3) return text;

  return `*****${text.slice(-maxLength)}`;
};
