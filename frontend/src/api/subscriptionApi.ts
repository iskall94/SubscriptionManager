import axios from 'axios';
import type { Subscription, CreateSubscriptionRequest } from '../types/subscription';
import { getAuthHeader } from './authApi';

const API_BASE_URL = '/api';

export async function getSubscriptions(): Promise<Subscription[]> {
	const response = await axios.get<Subscription[]>(
			`${API_BASE_URL}/subscriptions`, 
			getAuthHeader());
	return response.data;
}

export async function createSubscription(subscription: CreateSubscriptionRequest): Promise<Subscription> {
	const response = await axios.post<Subscription>(
			`${API_BASE_URL}/subscriptions`,
			subscription,
			getAuthHeader()
	);
	return response.data;
}

export async function deleteSubscription(subscriptionId: string): Promise<void> {
	await axios.delete(
			`${API_BASE_URL}/subscriptions/${subscriptionId}`,
			getAuthHeader()
	);
}

export async function updateSubscription(id: number, data: Partial<Subscription>): Promise<Subscription> {
  const response = await axios.put<Subscription>(
		`/api/subscriptions/${id}`, 
		data,
    getAuthHeader()
  );
  return response.data;
}