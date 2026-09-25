import axios from 'axios';
import type { Subscription, CreateSubscriptionRequest } from '../types/subscription';

const API_BASE_URL = '/api';

function getAuthHeader() {
    const token = localStorage.getItem('accessToken')
    return  {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

export async function getSubscriptions(): Promise<Subscription[]> {
    const response = await axios.get<Subscription[]>(
        `${API_BASE_URL}/subscription`, 
        getAuthHeader());
    return response.data;
}

export async function createSubscription(subscription: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await axios.post<Subscription>(
        `${API_BASE_URL}/subscription`,
        subscription,
        getAuthHeader()
    );
    return response.data;
}

export async function deleteSubscription(subscriptionId: string): Promise<void> {
    await axios.delete(
        `${API_BASE_URL}/subscription/${subscriptionId}`,
        getAuthHeader()
    );
}