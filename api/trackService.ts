const OxoApiUrl = process.env.NEXT_PUBLIC_OXO_API_URL;
import Cookies from "js-cookie";

export const trackVisitorPage = async (username?: string) => {
  const response = await fetch(`${OxoApiUrl}/api/track/${username}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracking_id: Cookies.get(`${username}_tracking_id`) || "",
    }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to track visitor page");
  }
  return responseData;
};