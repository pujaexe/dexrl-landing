"use client";

import { useQuery } from "@tanstack/react-query";
import { getAffiliateByUsername } from "@/services/affiliateService";
import { HOUSE_USERNAME } from "@/lib/router-compat";

export interface HouseConfig {
  title?: string | null;
  content?: string | null;
  background?: string | null;
  color?: string | null;
  buttons?: unknown;
  affiliate?: { id: string; crypto_settings?: unknown };
}

/**
 * Loads the single global "house" affiliate page (title/content/background/color
 * + crypto_settings). Set via the affiliate dashboard My Page for
 * NEXT_PUBLIC_HOUSE_USERNAME. Fails soft so the widget still renders with
 * defaults when no house row exists.
 */
export function useHouseConfig() {
  return useQuery<HouseConfig>({
    queryKey: ["house-config", HOUSE_USERNAME],
    queryFn: () => getAffiliateByUsername(HOUSE_USERNAME) as Promise<HouseConfig>,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
