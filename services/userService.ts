import { supabase } from "../lib/supabaseClient";
import { apiRequest } from "./oxo/idrx/request";

export async function getOrCreateUser(body: {
  fullname: string;
  is_google: boolean;
  avatar_url?: string;
  email: string;
  swc_seed?: string;
  is_active?: boolean;
  login_count: number;
}) {
  const newUser = {
    ...body,
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const existUser = await getUserByEmail(body.email)

  if (existUser) {
    return existUser;
  }

  // create new user
  return await apiRequest("/transactions/user", "POST", newUser);
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserByWalletAddress(wallet: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("fullname", wallet)
      .maybeSingle();

    if (error) return null;

    return data;
  } catch (error) {
    return null;
  }
}

export async function getWallet(wallet_id: string) {
  const { data, error } = await supabase
    .from("wallet")
    .select("*")
    .eq("id", wallet_id)
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}
