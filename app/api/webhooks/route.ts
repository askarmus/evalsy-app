import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text(); // ✅ Correct way to read body in Next.js App Router
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle Stripe events
  switch (event.type) {
    case "invoice.paid":
      console.log("✅ Invoice Paid:", event.data.object);
      break;
    case "invoice.payment_failed":
      console.log("❌ Payment Failed:", event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}
