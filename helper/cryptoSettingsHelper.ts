export type WhitelistToken = {
  value: string;
  label: string;
  token_symbol?: string;
  token_address?: string;
  chain_id?: number;
};

export const tokenWhitelistKey = (
  chainId: number | string | undefined | null,
  address: string | undefined | null
) => `${Number(chainId)}:${(address ?? "").toLowerCase()}`;

export const buildTokenWhitelist = (tokens?: WhitelistToken[]) => {
  const keys = new Set<string>();
  const legacySymbols = new Set<string>();
  const addressesByChain = new Map<number, string[]>();

  (tokens ?? []).forEach((t) => {
    if (t.token_address && t.chain_id !== undefined && t.chain_id !== null) {
      keys.add(tokenWhitelistKey(t.chain_id, t.token_address));
      const chainId = Number(t.chain_id);
      const existing = addressesByChain.get(chainId) ?? [];
      existing.push(t.token_address);
      addressesByChain.set(chainId, existing);
    } else {
      const symbol = (t.token_symbol ?? t.value ?? "").toLowerCase();
      if (symbol) legacySymbols.add(symbol);
    }
  });

  return { keys, legacySymbols, addressesByChain };
};

type CandidateToken = {
  token_symbol?: string;
  symbol?: string;
  token_address?: string;
  address?: string;
  chain_id?: number | string;
  chainId?: number | string;
};

export const isTokenAllowed = (
  token: CandidateToken,
  whitelist?: WhitelistToken[]
) => {
  const symbol = (token.token_symbol ?? token.symbol ?? "").toLowerCase();
  if (symbol === "idrx") return true;
  if (!whitelist || whitelist.length === 0) return true;

  const { keys, legacySymbols } = buildTokenWhitelist(whitelist);
  const chainId = token.chain_id ?? token.chainId;
  const address = token.token_address ?? token.address;
  if (keys.has(tokenWhitelistKey(chainId, address))) return true;

  return legacySymbols.has(symbol);
};
