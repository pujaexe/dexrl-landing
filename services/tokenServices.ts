import type { Token } from "../data/interface";
import { supabase } from "../lib/supabaseClient";

export const fetchTokenList = async (
  startPage: number,
  endPage: number
): Promise<Token[]> => {
  const { data, error } = await supabase
    .from("token_list")
    .select("*")
    .range(startPage, endPage);

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const getChainList = async () => {
  const { data, error } = await supabase
    .from("chain_list")
    .select("chain_id, chain_name");

  const uniqueMap = new Map(
    data?.map((d) => [d.chain_id, d.chain_name.trim()])
  );

  const chainList = Array.from(uniqueMap, ([value, label]) => ({
    value, // chain_id
    label, // chain_name
  }));

  if (error) throw new Error(error.message);
  return chainList ?? [];
};

export const getTokenListByIdChain = async (chainId: number) => {
  const { data, error } = await supabase
    .from("token_list")
    .select("token_name, token_symbol, token_address")
    .eq("chain_id", chainId);

  const tokenList =
    data?.map((d) => ({
      value: `${chainId}:${d.token_address}`,
      label: d.token_name,
      token_symbol: d.token_symbol,
      token_address: d.token_address,
      chain_id: chainId,
    })) ?? [];
  if (error) throw new Error(error.message);
  return tokenList ?? [];
};

export const searchTokensByChains = async (
  chainIds: number[],
  search: string,
  perChainLimit = 20
) => {
  if (!chainIds || chainIds.length === 0) return [];

  const perChain = await Promise.all(
    chainIds.map(async (chainId) => {
      let query = supabase
        .from("token_list")
        .select("token_name, token_symbol, token_address, chain_id")
        .eq("chain_id", chainId)
        .order("sort", { ascending: true, nullsFirst: false })
        .order("token_symbol", { ascending: true })
        .limit(perChainLimit);

      if (search) {
        query = query.or(
          [
            `token_symbol.ilike.%${search}%`,
            `token_name.ilike.%${search}%`,
            `token_address.ilike.%${search}%`,
          ].join(",")
        );
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data ?? [];
    })
  );

  return perChain.flat().map((d) => ({
    value: `${d.chain_id}:${d.token_address}`,
    label: d.token_name,
    token_name: d.token_name,
    token_symbol: d.token_symbol,
    token_address: d.token_address,
    chain_id: Number(d.chain_id),
  }));
};

export const addCryptoSettings = async (payload: any, affiliateId: string) => {
  const { data, error } = await supabase
    .from("affiliate")
    .update([payload])
    .eq("id", affiliateId)
    .select()
    .single();

  if (error) console.error("Update error:", error);
  return data;
};

export const getCryptoSettings = async (affiliateId: string) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select("crypto_settings")
    .eq("id", affiliateId)
    .single();

  if (error) console.error("Get data error:", error);
  return data;
};
