import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    // Cancel at the end of the billing cycle
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true, // ✅ Keeps it active until the end of the billing period
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
