import Cookies from "js-cookie";
import { useTradingAuthStore } from "@/store/tradingAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest<T>(
  api: string,
  method = "GET",
  data: any
): Promise<T> {
  // const mode = process.env.NEXT_PUBLIC_MODE;
  
  // Get token from cookies (for widget/ components and affiliate)
  const cookieToken = Cookies.get("token") || Cookies.get("token_signup");
  
  // Get JWT token from trading auth store (for trading/ components)
  const jwtToken = useTradingAuthStore.getState().jwtToken;
  
  // Prioritize JWT token if available, fallback to cookie token
  const token = jwtToken || cookieToken;

  const url: URL = new URL("/api" + api, BASE_URL);

  // if (mode === "local") {
  //   url = new URL("/api" + api, BASE_URL);
  // } else {
  //   url = new URL("/api" + api, window.location.origin);
  // }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (method === "GET" && data) {
    Object.entries(data).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  } else if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const responseBody = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // 🔥 Tangkap berbagai format pesan error dari backend
      const errorMessage =
        (typeof responseBody === "object" &&
          (responseBody.message ||
            responseBody.error ||
            responseBody.detail)) ||
        response.statusText ||
        "Unknown error";

      throw new Error(errorMessage);
    }

    return responseBody;
  } catch (error: any) {
    console.warn("API request failed:", error?.message || error);
    throw error;
  }
}

/**
 * Build query string from params object
 * Automatically filters out undefined/null values
 * @param params - Object with query parameters
 * @returns Query string (without leading '?') or empty string
 */
 
export const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
};