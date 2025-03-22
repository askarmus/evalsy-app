import apiClient from "@/helpers/apiClient";

// Get user's subscription details
export const getSubscription = async () => {
  const response = await apiClient.get("/subscription/getSubscription");
  return response.data;
};

// Create a new subscription (redirect to Stripe Checkout)
export const createSubscription = async () => {
  const response = await apiClient.post("/subscription/subscribe");
  return response.data;
};

// Cancel an active subscription
export const cancelSubscription = async () => {
  const response = await apiClient.post("/subscription/cancelSubscription");
  return response.data.message;
};

// Get the current status of the subscription
export const getSubscriptionStatus = async () => {
  const response = await apiClient.get("/subscription/getSubscriptionStatus");
  return response.data;
};

// Get subscription usage for metered billing items
export const getSubscriptionUsage = async () => {
  const response = await apiClient.get("/subscription/getUsageSummary");
  return response.data.data;
};
