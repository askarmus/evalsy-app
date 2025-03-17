import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Premium Subscription" },
            unit_amount: amount, // Amount in cents ($50.00 = 5000)
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("Error starting checkout:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
