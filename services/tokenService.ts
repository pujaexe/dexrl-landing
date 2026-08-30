import { supabase } from "../lib/supabaseClient";
import { isTokenAllowed } from "../helper/cryptoSettingsHelper";

export const getListToken = async () => {
  const { data, error } = await supabase
    .from("token_list")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const getListChains = async () => {
  const { data, error } = await supabase
    .from("chain_list")
    .select(`
      *,
      tokens:token_list(count)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const result = data.map(chain => ({
    ...chain,
    tokenCount: chain.tokens[0]?.count || 0
  }));

  return result;
};


const buildWhitelistOr = (params?: {
  hasTokenWhitelist?: boolean;
  allowedTokenAddresses?: string[];
  allowedTokenSymbols?: string[];
}) => {
  if (!params?.hasTokenWhitelist) return null;

  const orParts: string[] = [];
  if (params.allowedTokenAddresses?.length) {
    const list = params.allowedTokenAddresses.map((a) => `"${a}"`).join(",");
    orParts.push(`token_address.in.(${list})`);
  }
  if (params.allowedTokenSymbols?.length) {
    params.allowedTokenSymbols.forEach((s) =>
      orParts.push(`token_symbol.ilike.${s}`)
    );
  }
  orParts.push("token_symbol.ilike.idrx");
  return orParts.join(",");
};

// get list token pagination
export const getListTokenNew = async (params?: {
  page?: number;
  pageSize?: number;
  chain_id?: string | number;
  search?: string;
  orderBy?: string;
  hasTokenWhitelist?: boolean;
  allowedTokenAddresses?: string[];
  allowedTokenSymbols?: string[];
}) => {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const orderBy = params?.orderBy || "sort";

  let query = supabase
    .from("token_list")
    .select("*", { count: "exact" })
    .order(orderBy, { ascending: true, nullsFirst: false })
    .order("token_symbol", { ascending: true })

  // Filter by chain_id if provided
  if (params?.chain_id !== undefined) {
    const chainId = typeof params.chain_id === "string" ? parseInt(params.chain_id) : params.chain_id;
    if (!isNaN(chainId)) {
      query = query.eq("chain_id", chainId);
    }
  }

  const whitelistOr = buildWhitelistOr(params);
  if (whitelistOr) {
    query = query.or(whitelistOr);
  }

  // Filter by search if provided
  if (params?.search) {
    const s = params.search;
    query = query.or(
      [
        `token_symbol.ilike.%${s}%`,
        `token_name.ilike.%${s}%`,
        `token_address.ilike.%${s}%`,
        `chain_name.ilike.%${s}%`
      ].join(",")
    );
  }


  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    meta: {
      page,
      pageSize,
      total: count || 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    },
  };
};

export const getListOtherToken = async (params?: {
  page?: number;
  pageSize?: number;
  chain_id?: string | number;
  search?: string;
  hasTokenWhitelist?: boolean;
  allowedTokenAddresses?: string[];
  allowedTokenSymbols?: string[];
}) => {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;

  let query = supabase
    .from("token_list")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true });

  // Filter by chain_id if provided
  if (params?.chain_id !== undefined) {
    const chainId = typeof params.chain_id === "string" ? parseInt(params.chain_id) : params.chain_id;
    if (!isNaN(chainId)) {
      query = query.not("chain_id", "eq", chainId);
    }
  }

  const whitelistOr = buildWhitelistOr(params);
  if (whitelistOr) {
    query = query.or(whitelistOr);
  }

  // Filter by search if provided
  if (params?.search) {
    query = query.or(
      `token_symbol.ilike.%${params.search}%,` +
      `token_name.ilike.%${params.search}%,` +
      `token_address.ilike.%${params.search}%,` +
      `chain_name.ilike.%${params.search}%`
    );
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    meta: {
      page,
      pageSize,
      total: count || 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    },
  };
};

// get detail token by chain_id and token_address
export const getDetailToken = async (chain_id: number, token_address: string) => {
  const { data, error } = await supabase
    .from("token_list")
    .select("*")
    .eq("chain_id", chain_id)
    .eq("token_address", token_address)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    address: data.token_address,
    chainId: data.chain_id,
    decimals: data.token_decimals,
    logoURI: data.logo_url,
    name: data.token_name,
    symbol: data.token_symbol,
    ...data,
  };
};

//get detail chain by id
export const getDetailChain = async (id: string) => {
  const { data, error } = await supabase
    .from("chain_list")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  const { data: tokenList, error: tokenListError } = await supabase
    .from("token_list")
    .select("token_name, token_symbol")
    .eq("chain_id", id)
    .order("created_at", { ascending: true });

  if (tokenListError) throw tokenListError;

  return {
    data: data,
    tokenList: tokenList || [],
  };
};

/**
 * Fetches the first valid token based on crypto settings.
 * Used for fallback when current default tokens are restricted by an affiliator.
 */
export const getFirstValidToken = async (cryptoSettings: {
  chain: Array<{ value: number; label: string }>;
  token: Array<{ value: string; label: string }>;
}) => {
  if (!cryptoSettings.chain || cryptoSettings.chain.length === 0) return null;

  // Try to find the first valid token on the allowed chains
  for (const chain of cryptoSettings.chain) {
    const chainId = chain.value;

    const { data: tokens, error } = await supabase
      .from("token_list")
      .select("*, chain:chain_list(*)")
      .eq("chain_id", chainId)
      .order("sort", { ascending: true, nullsFirst: false })
      .order("token_symbol", { ascending: true });

    if (error || !tokens) continue;

    let validTokens = tokens;

    // Filter by allowed tokens if specified
    if (cryptoSettings.token && cryptoSettings.token.length > 0) {
      validTokens = tokens.filter((t: any) =>
        isTokenAllowed(t, cryptoSettings.token)
      );
    }

    if (validTokens.length > 0) {
      const token = validTokens[0] as any;
      const chainData = token.chain;
      return {
        address: token.token_address,
        chainId: token.chain_id,
        decimals: token.token_decimals,
        logoURI: token.logo_url,
        name: token.token_name,
        symbol: token.token_symbol,
        isActive: token.is_active,
        chain: chainData
          ? {
              id: chainData.chain_id,
              logoURI: chainData.logo_url,
              key: chainData.chain_key,
              name: chainData.chain_name,
              metamask: {
                rpcUrls: chainData.rpc_urls,
                blockExplorerUrls: chainData.block_explorer_urls,
              },
              nativeToken: { address: chainData.native_token_address },
              color: chainData.color,
            }
          : undefined,
      };
    }
  }

  return null;
};