import { supabase } from "../lib/supabaseClient";
import { apiRequest } from "./oxo/idrx/request";

export interface Address {
  id?: string;
  user_id: string;
  address: string;
  type: "eoa" | "swc";
  custody: "self" | "oxo";
  provider: "metamask" | "oxo" | "other";
  is_primary: boolean;
  last_used?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getSWCAddress(userId: string): Promise<Address | null> {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "swc")
      .not("address", "is", null)
      .single();

    if (error) {
      console.error("Error getting SWC address:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting SWC address:", error);
    return null;
  }
}

export async function getEOAAddress(userId: string): Promise<Address | null> {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "eoa")
      .not("address", "is", null)
      .single();

    if (error) {
      console.error("Error getting EOA address:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting EOA address:", error);
    return null;
  }
}

export async function upsertEOAAddress(
  userId: string,
  eoaAddress: string,
  provider: "metamask" | "google" | "other"
): Promise<Address | null> {
  try {
    return await apiRequest(
      `/transactions/user/${userId}/eoa-address`,
      "POST",
      { eoa_address: eoaAddress, provider: provider }
    );
  } catch (error) {
    console.error("Error upserting EOA address:", error);
    return null;
  }
}

export async function upsertSWCAddress(
  userId: string,
  swcAddress: string,
  provider: "metamask" | "google" | "other"
): Promise<Address | null> {
  try {
    return await apiRequest(
      `/transactions/user/${userId}/swc-address`,
      "POST",
      {
        swc_address: swcAddress,
        provider: provider,
      }
    );
  } catch (error) {
    console.error("Error upserting SWC address:", error);
    return null;
  }
}
