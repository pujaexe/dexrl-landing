import { apiRequest } from "./oxo/idrx/request";

export async function getSettingByName(name: string = "service_fee") {
  const result = await apiRequest<{ data: any }>("/settings", "GET", { name });
  return result?.data;
}
