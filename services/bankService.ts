import { supabase } from "../lib/supabaseClient";
import { apiRequest } from "./oxo/idrx/request";

export async function saveBank(
  addressId: string,
  body: {
    bankAccountNumber: string;
    bankAccountName: string;
    bankCode: string;
    bankName: string;
    maxAmountTransfer: number;
    logoUrl?: string;
  }
) {
  const isExistBankAccount = await getBankWithAccountNumber(
    addressId,
    body.bankAccountNumber
  );
  if (!isExistBankAccount) {
    const newBank = {
      bank_account_number: body.bankAccountNumber,
      bank_account_name: body.bankAccountName,
      bank_code: body.bankCode,
      bank_name: body.bankName,
      max_amount_transfer: body.maxAmountTransfer,
      logo_url: body.logoUrl,
      address_id: addressId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return await apiRequest("/transactions/bank", "POST", newBank);
  } else {
    return isExistBankAccount;
  }
}

export async function getBankList(addressId: string) {
  const { data, error } = await supabase
    .from("bank_list")
    .select("*")
    .eq("address_id", addressId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBank(bankId: string) {
  const { data, error } = await supabase
    .from("bank_list")
    .select("*")
    .eq("id", bankId)
    .order("created_at", { ascending: false })
    .single();

  if (error) throw error;
  return data;
}

export async function getBankWithAccountNumber(
  addressId: string,
  bankAccountNumber: string
) {
  const { data, error } = await supabase
    .from("bank_list")
    .select("*")
    .eq("address_id", addressId)
    .eq("bank_account_number", bankAccountNumber)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBankTransferList(): Promise<any[]> {
  const { data, error } = await supabase
    .from("bank_info")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
