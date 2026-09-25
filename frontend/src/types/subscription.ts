export interface Subscription {
	id: number;
  name: string;
  price: number;
	currency: string;
  interval: number;
  startDate?: string;
	nextBillingDate?: string;
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  currency: string;
	interval: number;
	firstBillingDate: string;
	nextBillingDate: string;
	categoryId?: number;
}