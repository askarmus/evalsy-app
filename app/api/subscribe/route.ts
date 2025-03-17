import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Create a Stripe customer
    const customer = await stripe.customers.create({ email });

    // Create a Stripe Checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"], // ✅ This is allowed in `checkout.sessions.create()`
      mode: "subscription", // ✅ Ensures recurring payments
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&tab=subscriptions&status=success`, // Redirect to success page
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}//company/settings?tab=subscriptions&status=cancelled`,
      line_items: [
        { price: "price_1R3bqQPcvZoiNWtPoBO6mxyS", quantity: 1 }, // Base Plan ($20/month)
        { price: "price_1R3btRPcvZoiNWtPkOZJUzCu" }, // Metered Billing ($0.10 per invite)
      ],
    });

    return NextResponse.json({ url: session.url }); // Redirect user to Stripe Checkout
  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
