import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    // Fetch subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status, // e.g., active, canceled, past_due
      cancelAtPeriodEnd: subscription.cancel_at_period_end, // true if cancellation is scheduled
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 });
  }
}
