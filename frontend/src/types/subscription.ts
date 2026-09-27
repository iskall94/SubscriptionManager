export interface Subscription {
	id: number;
  name: string;
  price: number;
	currency: string;
  interval: number;
  firstBillingDate: string;
	nextBillingDate: string;
  categoryId: number;
  categoryName: string;
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  currency: string;
	interval: number;
	firstBillingDate: string;
	nextBillingDate: string;
	categoryId: number;
}

export interface UpdateSubscriptionRequest {
  name: string;
  price: number;
  currency: string;
  interval: number;
  firstBillingDate: string;
  nextBillingDate: string;
  categoryId: number;
}