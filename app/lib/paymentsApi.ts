import { apiGetClient } from "./api";
import type { SubscriptionInfo } from "./subscriptionData";
import { mapSubscriptionInfo } from "./subscriptionApi";
import { userPost } from "./userApi";

export type PayPalConfig = {
  client_id: string;
  currency: string;
};

export async function fetchPayPalConfig(): Promise<PayPalConfig> {
  return apiGetClient<PayPalConfig>("/payments/paypal/config/");
}

export async function createPayPalOrder(planSlug: string): Promise<string> {
  const data = await userPost<{ order_id: string }>("/payments/paypal/create-order/", {
    plan_slug: planSlug,
  });
  return data.order_id;
}

export async function capturePayPalOrder(orderId: string): Promise<SubscriptionInfo> {
  const data = await userPost<{
    status: string;
    subscription: Parameters<typeof mapSubscriptionInfo>[0];
  }>("/payments/paypal/capture-order/", { order_id: orderId });
  return mapSubscriptionInfo(data.subscription);
}
