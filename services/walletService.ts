import { supabase } from "../lib/supabaseClient";

export async function saveUserWallet(wallet: {
  user_id: string;
  address: string;
  name: string;
  holder: string;
}) {
  const { data, error } = await supabase.from("wallet").insert([wallet]);

  if (error) throw error;
  return data;
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
