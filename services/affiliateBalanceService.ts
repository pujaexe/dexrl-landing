const OxoApiUrl = process.env.NEXT_PUBLIC_OXO_API_URL;

export interface InsertAffiliateBalanceData {
  affiliate_id: string;
  type?: string;
  amount: number;
  description?: string;
  method?: string;
  bank_id?: number;
  account_name?: string;
  account_number?: string;
}

interface GetAffiliateBalanceParams {
  page?: number;
  pageSize?: number;
  status?: string;
  affiliate_id?: string;
  type?: string;
  method?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: string;
}

interface GetAffiliateBalanceSummaryParams {
  affiliate_id?: string;
  start_date?: string;
  end_date?: string;
}

interface UpdateStatusData {
  status: string;
  admin_id: string;
}

export const insertAffiliateBalance = async (data: InsertAffiliateBalanceData) => {
  const response = await fetch(`${OxoApiUrl}/api/affiliate-balance`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to insert affiliate balance");
  }
  return responseData;
};

export const getAffiliateBalance = async (params: GetAffiliateBalanceParams = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${OxoApiUrl}/api/affiliate-balance?${queryParams.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get affiliate balance");
  }
  const data = await response.json();
  return data;
};

export const getAffiliateBalanceSummary = async (filters: GetAffiliateBalanceSummaryParams = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${OxoApiUrl}/api/affiliate-balance/summary?${queryParams.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get affiliate balance summary");
  }
  const data = await response.json();
  return data.data;
};

export const updateStatusAffiliateBalance = async (id: string, data: UpdateStatusData) => {
  const response = await fetch(`${OxoApiUrl}/api/affiliate-balance/${id}/status`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to update affiliate balance status");
  }
  return response.json();
};
