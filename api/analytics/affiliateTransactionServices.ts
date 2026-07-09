const OxoApiUrl = process.env.NEXT_PUBLIC_OXO_API_URL;

export const getTrxByChain = async (
  is_management: boolean = true,
  username?: string,
  filterQuery?: string
) => {
  const url = is_management ? "management-dashboard" : "affiliate-dashboard"
  const response = await fetch(
    `${OxoApiUrl}/api/dashboard/${url}?affiliator=${username}&${filterQuery}`
  );

  if (!response.ok) {
    throw new Error("Failed to get transaction by chain");
  }
  return response.json();
};
