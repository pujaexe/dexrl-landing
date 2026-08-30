const OxoApiUrl = process.env.NEXT_PUBLIC_OXO_API_URL;

export const getOxoDashboardOverview = async (username?: string) => {
  try {
    const response = await fetch(`${OxoApiUrl}/api/track/dashboard?username=${username}`);

    if (!response.ok) {
      throw new Error("Failed to get dashboard overview");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getOxoDashboardOverview:", error);
    throw error;
  }
};

export const getSalesOverview = async (
  username?: string,
  filterQuery: string = "lifetime"
) => {
  try {
    const response = await fetch(
      `${OxoApiUrl}/api/sales?affiliator=${username}&filter=${filterQuery}`
    );

    if (!response.ok) {
      throw new Error("Failed to get sales overview");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getSalesOverview:", error);
    throw error;
  }
};

export const getCommissionOverview = async (
  username?: string,
  filterQuery: string = "lifetime"
) => {
  try {
    const response = await fetch(
      `${OxoApiUrl}/api/commission?affiliator=${username}&filter=${filterQuery}`
    );

    if (!response.ok) {
      throw new Error("Failed to get commission overview");
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getCommissionOverview:", error);
    throw error;
  }
};

export const getOrderTypeOverview = async (username?: string) => {
  try {
    const response = await fetch(
      `${OxoApiUrl}/api/order-type?affiliator=${username}&filter=this_year`
    );

    if (!response.ok) {
      throw new Error("Failed to get order-type overview");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getOrderTypeOverview:", error);
    throw error;
  }
};
export const getSourceOverview = async (username?: string) => {
  try {
    const response = await fetch(
      `${OxoApiUrl}/api/source-overview?affiliator=${username}&filter=this_year`
    );

    if (!response.ok) {
      throw new Error("Failed to get source overview");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getSourceOverview:", error);
    throw error;
  }
};

export const getTopChain = async (username?: string) => {
  try {
    const response = await fetch(
      `${OxoApiUrl}/api/top-chain?affiliator=${username}&filter=this_year`
    );

    if (!response.ok) {
      throw new Error("Failed to get Top Chain");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getTopChain:", error);
    throw error;
  }
};

export const getRevenueOverview = async (filterQuery: string = "lifetime") => {
  try {
    const response = await fetch(
      `${OxoApiUrl}/api/dashboard/management-revenue?filter=${filterQuery}`
    );

    if (!response.ok) {
      throw new Error("Failed to get revenue overview");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error in getRevenueOverview:", error);
    throw error;
  }
};
