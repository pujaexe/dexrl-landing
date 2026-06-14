import { supabase } from "../lib/supabaseClient";

export const getSetting = async (keyName: string = "service_fee") => {
  const { data, error } = await supabase.from("settings").select("*").ilike("name", keyName).single();

  if (error) throw error;
  return data;
};

export const getSettingValue = async (
  keyName: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .ilike("name", keyName)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      console.error("Error fetching setting value:", error);
      throw error;
    }

    return data.value;
  } catch (error) {
    console.error("Failed to fetch setting value:", error);
    throw error;
  }
};
