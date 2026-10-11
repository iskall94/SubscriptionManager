import axios from 'axios';
import type { 
  PaymentHistory, 
  CreatePaymentHistoryRequest, 
  UpdatePaymentStatusRequest 
} from '../types/paymentHistory';
import { getAuthHeader } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getAllPayments(): Promise<PaymentHistory[]> {
  const response = await axios.get<PaymentHistory[]>(
    `${API_BASE_URL}/payments`,
    getAuthHeader()
  );
  return response.data;
}

export async function getPaymentsForSubscription(subscriptionId: number): Promise<PaymentHistory[]> {
  const response = await axios.get<PaymentHistory[]>(
    `${API_BASE_URL}/subscriptions/${subscriptionId}/payments`,
    getAuthHeader()
  );
  return response.data;
}

export async function recordPayment(
  subscriptionId: number, 
  payment: CreatePaymentHistoryRequest
): Promise<PaymentHistory> {
  const response = await axios.post<PaymentHistory>(
    `${API_BASE_URL}/subscriptions/${subscriptionId}/payments`,
    payment,
    getAuthHeader()
  );
  return response.data;
}

export async function updatePaymentStatus(
  id: number, 
  statusUpdate: UpdatePaymentStatusRequest
): Promise<PaymentHistory> {
  const response = await axios.patch<PaymentHistory>(
    `${API_BASE_URL}/payments/${id}/status`,
    statusUpdate,
    getAuthHeader()
  );
  return response.data;
}

export async function deletePayment(id: number): Promise<void> {
  await axios.delete(
    `${API_BASE_URL}/payments/${id}`,
    getAuthHeader()
  );
}
