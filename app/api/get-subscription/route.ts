import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    // Fetch subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ isSubscribed: false });
    }

    return NextResponse.json({
      isSubscribed: true,
      subscriptionId: subscriptions.data[0].id,
      cancelAtPeriodEnd: subscriptions.data[0].cancel_at_period_end,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 });
  }
}
