import { apiRequest } from "./oxo/idrx/request";

export interface ManagementTransactionDetail {
  transaction: {
    id: string;
    trx_no: string;
    trx_type: string;
    trx_date: string;
    status: string;
    amount: number;
    amount_token: number;
    market_price?: number;
    from_chain_id: number | string;
    to_chain_id: number | string;
    from_token: string;
    to_token: string;
    tx_hash?: string;
    burn_tx_hash?: string;
    affiliator?: string;
    address_id?: string;
    service_fee?: number;
    affiliate_fee?: number;
    other_fee?: number;
    to_address?: string;
    bank_id?: string;
    refund_tx_hash?: string;
    refund_address?: string;
    refund_at?: string;
    refund_note?: string;
    refund_status?: RefundStatus | null;
    refund_initiated_at?: string;
    refund_error?: string;
    created_at: string;
    updated_at?: string;
    payment?: {
      payment_ref: string;
      status: string;
      updated_at: string;
    };
    bank?: {
      id: string;
      bank_name: string;
      bank_code: string;
      bank_account_number: string;
      bank_account_name: string;
    };
  };
  deposit: {
    id: string;
    chain_id: number | string;
    address: string;
    derivation_index: number;
    expected_amount: number;
    expected_token: string;
    status: string;
    tx_hash?: string;
    detected_amount?: number;
    detected_at?: string;
    confirmed_at?: string;
    expires_at: string;
    created_at: string;
  } | null;
  user: {
    address?: string;
    email?: string | null;
    fullname?: string | null;
  } | null;
  is_refundable: boolean;
  oxo_refund_address: string | null;
}

export type RefundStatus = "pending" | "submitted" | "confirmed" | "failed";

export interface RefundPayload {
  note?: string;
  adminEmail: string;
}

export interface RefundStatusResponse {
  trx_no: string;
  status: string;
  refund_status: RefundStatus | null;
  refund_tx_hash: string | null;
  refund_address: string | null;
  refund_initiated_at: string | null;
  refund_at: string | null;
  refund_error: string | null;
  refund_note: string | null;
}

export const getManagementTransactionDetail = async (
  trxNo: string
): Promise<ManagementTransactionDetail> => {
  const response = await apiRequest<{ data: ManagementTransactionDetail }>(
    `/dashboard/transactions/${trxNo}/detail`,
    "GET",
    null
  );
  return response.data;
};

export const refundManagementTransaction = async (
  trxNo: string,
  payload: RefundPayload
): Promise<any> => {
  return await apiRequest<any>(
    `/dashboard/transactions/${trxNo}/refund`,
    "POST",
    payload
  );
};

export const getRefundStatus = async (
  trxNo: string
): Promise<RefundStatusResponse> => {
  const response = await apiRequest<{ data: RefundStatusResponse }>(
    `/dashboard/transactions/${trxNo}/refund-status`,
    "GET",
    null
  );
  return response.data;
};
