import apiClient from "@/helpers/apiClient";

// Get user's subscription details
export const getSubscription = async () => {
  const response = await apiClient.get("/subscription/get-subscription");
  return response.data.subscription;
};

// Create a new subscription (redirect to Stripe Checkout)
export const createSubscription = async () => {
  const response = await apiClient.post("/subscription/create-checkout-session");
  return response.data.sessionId;
};

// Cancel an active subscription
export const cancelSubscription = async () => {
  const response = await apiClient.post("/subscription/cancel-subscription");
  return response.data.message;
};
