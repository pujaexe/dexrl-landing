import type { BaseParams, SetupAffilateAccount, SubmitForgotPassword, SubmitResetPassword, SubmitVerifyOTP } from "../data/interface";
import { supabase } from "../lib/supabaseClient";
import bcrypt from "bcryptjs";
import { apiRequest } from "./oxo/idrx/request";

export const setupAffilateAccount = async (payload: SetupAffilateAccount) => {
  try {
    const response = await apiRequest<{ data: { jwt_token: string; user: any }, message: string, success: boolean }>("/affiliate/update-password", "POST", payload);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

export const checkRegisteredAffiliate = async (email: string | null) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  } else if (data) {
    return data;
  } else {
    throw new Error("Email not registered. Please sign up!");
  }
};

export const getAffiliateUsername = async (email: string | null) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select("username,slug,id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const addAffiliatePage = async (payload: any, affiliateId: string) => {
  const { data } = await supabase
    .from("affiliate_page")
    .select("*")
    .eq("user_id", affiliateId)
    .maybeSingle();

  if (!data) {
    const { data: affiliatePageData, error: insertErr } = await supabase
      .from("affiliate_page")
      .insert([{ ...payload, user_id: affiliateId }])
      .select()
      .maybeSingle();

    if (insertErr) console.error("Insert error:", insertErr);

    return affiliatePageData;
  } else {
    const { data: updateAffiliatePage, error: updateErr } = await supabase
      .from("affiliate_page")
      .update([payload])
      .eq("user_id", affiliateId)
      .select()
      .maybeSingle();

    if (updateErr) console.error("Update error:", updateErr);
    return updateAffiliatePage;
  }
};

export const getAffiliatePage = async (affiliateId: string) => {
  const { data, error } = await supabase
    .from("affiliate_page")
    .select("*")
    .eq("user_id", affiliateId)
    .maybeSingle();

  if (error) console.error("Get error:", error);
  return data;
};

export const getAffiliateAccount = async (email: string | null) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select(
      "id, username, first_name, last_name, gender, date_of_birth, email, phone_number, is_management, is_verified"
    )
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateAffilliateAccount = async (
  affiliateId: string | null,
  payload: any
) => {
  const { error } = await supabase
    .from("affiliate")
    .update([payload])
    .eq("id", affiliateId)
    .select("first_name, last_name, gender, date_of_birth, email, phone_number")
    .maybeSingle();

  if (error) throw error;
  return {
    meta: {
      code: 200,
      status: "Success",
      message: "Your data successfully changed",
    },
  };
};

export const changePassword = async (
  affiliateId: string | null,
  payload?: any
) => {
  const { data: getPassword, error } = await supabase
    .from("affiliate")
    .select("password")
    .eq("id", affiliateId)
    .maybeSingle();

  if (error) throw error;
  // check between input payload and db data
  const isValidPassword = await bcrypt.compare(
    payload.current_password,
    getPassword?.password
  );

  if (isValidPassword) {
    const saltRounds = 10;
    const hasNewPassword = await bcrypt.hash(
      payload.new_password || "",
      saltRounds
    );
    await supabase
      .from("affiliate")
      .update([{ password: hasNewPassword }])
      .eq("id", affiliateId)
      .select("password")
      .maybeSingle();
  } else {
    throw new Error("Invalid current password! You don't have authority!");
  }
  return {
    meta: {
      code: 200,
      status: "Success",
      message: "Your password successfully changed",
    },
  };
};

export const checkUsername = async (username: string) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getListAffilliateAccount = async ({
  page = 1,
  pageSize = 10,
  search = "",
}: BaseParams) => {
  let query = supabase
    .from("affiliate")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        username,
        is_management
      `,
      { count: "exact" }
    )
    .eq("is_management", false)
    .order("created_at", { ascending: false });

  if (search && search.trim() !== "") {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  // pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const usernames = data?.map((a) => a.username);
  const { data: transactions, error: errTx } = await supabase
    .from("history_transaction")
    .select("*")
    .eq("status", "completed")
    .in("affiliator", usernames || []);

  if (errTx) throw errTx;

  const dataWithStats = data?.map((affiliate) => {
    const affiliateTransactions = transactions?.filter(
      (tx) => tx.affiliator === affiliate.username
    );
    const sales = affiliateTransactions?.length || 0;
    const commission =
      affiliateTransactions?.reduce((sum, tx) => sum + (tx.affiliate_fee || 0), 0) ||
      0;

    return {
      ...affiliate,
      sales,
      commission: Math.round(commission),
    };
  });

  return {
    data: dataWithStats,
    meta: {
      page,
      pageSize,
      total: count || 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
    },
  };
};

export const getAffiliateById = async (id: string | null) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getAffiliateByUsername = async (username: string) => {
  const { data: affiliate, error: affiliateError } = await supabase
    .from("affiliate")
    .select("id, crypto_settings")
    .eq("username", username)
    .maybeSingle();

  if (affiliateError || !affiliate)
    throw affiliateError || new Error("Affiliate not found");

  const { data: page, error: pageError } = await supabase
    .from("affiliate_page")
    .select("title, content, background, color, buttons")
    .eq("user_id", affiliate.id)
    .maybeSingle();

  if (pageError) throw pageError;

  return {
    ...page,
    affiliate: affiliate,
  };
};

const OxoApiUrl = process.env.NEXT_PUBLIC_OXO_API_URL;
export const changeGoogleCodeToToken = async (googleCode: string) => {
  const response = await fetch(`${OxoApiUrl}/api/google/code`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: googleCode,
      redirect_uri: window.location.origin,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to change google code to token");
  }
  return response.json();
};

export const updateVerifyAffiliate = async (affiliateId: string) => {
  const response = await fetch(`${OxoApiUrl}/api/dashboard/affiliate/${affiliateId}/verify`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to verify affiliate");
  }
  return response.json();
};

export const submitForgotPassword = async (data: SubmitForgotPassword) => {
  const response = await fetch(`${OxoApiUrl}/api/affiliate/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to submit forgot password");
  }
  return responseData;
};

export const submitVerifyOTP = async (data: SubmitVerifyOTP) => {
  const response = await fetch(`${OxoApiUrl}/api/affiliate/verify-otp`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to submit verify otp");
  }
  return responseData;
};

export const submitResetPassword = async (data: SubmitResetPassword) => {
  const response = await fetch(`${OxoApiUrl}/api/affiliate/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to submit reset password");
  }
  return responseData;
};

export const loginAffiliateWithGoogle = async (googleCode: string) => {
  const payload = {
    code: googleCode,
    redirect_uri: window.location.origin,
    service: 'affiliate',
  }
  const response = await apiRequest<{
    data: {
      jwt_token:
      string, user: any
    },
    success: boolean,
    message: string,
    error: string
  }>(`/google/auth/code`, 'POST', payload);
  return response;
};