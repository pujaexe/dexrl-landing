import { useEffect, useState, useCallback } from "react";
import type { Token } from "../data/interface";
import { fetchTokenList } from "../services/tokenServices";

export function useToken() {
  const [data, setData] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchTokenList(0,9);
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
