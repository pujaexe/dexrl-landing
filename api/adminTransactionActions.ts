import { apiRequest } from "./oxo/idrx/request";

export const setTransactionFailed = async (
  trxNo: string,
  payload: { adminEmail: string; note?: string }
) => {
  return await apiRequest<any>(
    `/dashboard/transactions/${trxNo}/set-failed`,
    "POST",
    payload
  );
};

export const retryTransactionAdmin = async (
  trxNo: string,
  payload: { adminEmail: string }
) => {
  return await apiRequest<any>(
    `/dashboard/transactions/${trxNo}/retry`,
    "POST",
    payload
  );
};
