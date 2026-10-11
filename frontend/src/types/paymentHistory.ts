export type PaymentStatus = 1 | 2 | 3;

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  1: "Paid",
  2: "Pending",
  3: "Failed",
};

export interface PaymentHistory {
  id: number;
  subscriptionId: number;
  subscriptionName: string;
  amount: number;
  currency: string;
  paidAt: string;
  status: PaymentStatus;
}

export interface CreatePaymentHistoryRequest {
  amount: number;
  paidAt: string;
  status: PaymentStatus;
  advanceBillingCycle?: boolean;
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
}
