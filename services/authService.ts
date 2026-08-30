import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabaseClient";
import { apiRequest } from "./oxo/idrx/request";
import Cookies from "js-cookie";
import type { TradingUser, WalletState } from "@/data/interface";

export const loginWithGoogle = async (token: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: token,
    });

    if (error) {
      console.error("Google login error:", error.message);
      return { error };
    }

    return { data };
  } catch (err) {
    console.error("Unexpected login error:", err);
    return { error: err };
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
  }
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }

  return user;
};

export const affiliateLogin = async (payload: any) => {
  const { data, error } = await supabase
    .from("affiliate")
    .select("*")
    .or(`email.eq.${payload.username}`)
    .single();

  if (error) {
    throw new Error("User not registered. please sign up!");
  }

  const isValidPassword = await bcrypt.compare(payload.password, data.password);

  if (isValidPassword) {
    return {
      meta: {
        code: 200,
        status: "Success",
        message: "Login Success",
      },
      data: {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        is_google_login: false,
      },
    };
  } else {
    throw new Error("Invalid Password");
  }
};

/**
 * Login with email and password
 */
export const affiliateLoginV2 = async (payload: { email: string; password: string }) => {
  try {
    const response = await apiRequest<{ data: { jwt_token: string; user: any }, message: string, success: boolean }>("/affiliate/login", "POST", payload);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout user - remove token and user data
 */
export const affiliateLogout = () => {
  Cookies.remove("token");
  Cookies.remove("is_google_login");
  localStorage.removeItem("user");
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUserData = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = Cookies.get("token");
  const user = getCurrentUserData();
  return !!(token && user);
};

// ============================================================================
// Backend API Functions for Trading Module
// ============================================================================

/**
 * Login with Google OAuth (Backend API)
 * Used by trading/ components
 * 
 * @param code - Google OAuth authorization code
 * @param redirectUri - Redirect URI used in OAuth flow
 * @returns Promise with JWT, user, and wallet data
 */
export const loginWithGoogleBackend = async (code: string, redirectUri: string) => {
  try {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: {
        jwt: string;
        user: TradingUser;
        wallet: WalletState;
      };
    }>("/onramp/auth/login/google", "POST", { code, redirect_uri: redirectUri });
    
    return response;
  } catch (error: any) {
    console.error("Backend Google login error:", error);
    throw error;
  }
};

/**
 * Login with MetaMask (Backend API)
 * Used by trading/ components
 * No signature required for login - signature only needed for swap transactions
 * 
 * @param address - User's MetaMask address
 * @returns Promise with JWT, user, and wallet data
 */
export const loginWithMetamaskBackend = async (address: string) => {
  try {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: {
        jwt: string;
        user: TradingUser;
        wallet: WalletState;
      };
    }>("/onramp/auth/login/metamask", "POST", { address });
    
    return response;
  } catch (error: any) {
    console.error("Backend MetaMask login error:", error);
    throw error;
  }
};

/**
 * Get user profile (Backend API)
 * Used by trading/ components
 * 
 * @param token - JWT token
 * @returns Promise with user and wallet data
 */
export const getProfileBackend = async (token: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_OXO_API_URL;
    
    const response = await fetch(`${baseUrl}/api/onramp/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to get profile");
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Backend get profile error:", error);
    throw error;
  }
};

/**
 * Generate message for MetaMask signature (for swap transactions)
 * NOT used for login - only for swap transactions
 * 
 * @returns Message string with timestamp
 */
export const generateSwapMessage = (): string => {
  const timestamp = new Date().toISOString();
  return `Sign this message to authorize swap on OXO Exchange: ${timestamp}`;
};
