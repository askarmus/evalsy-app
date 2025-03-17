import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { subscriptionId, extraInvites } = await req.json();

    // Fetch subscription items
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const meteredItem = subscription.items.data.find((item) => item.price.id === "price_1R3btRPcvZoiNWtPkOZJUzCu");

    if (!meteredItem) {
      return NextResponse.json({ error: "Metered price item not found" }, { status: 400 });
    }

    // Report extra invite usage to Stripe
    await stripe.subscriptionItems.createUsageRecord(meteredItem.id, {
      quantity: extraInvites, // Only report invites beyond 50
      timestamp: Math.floor(Date.now() / 1000), // Current timestamp
      action: "increment", // Adds to existing count
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Usage Reporting Error:", error);
    return NextResponse.json({ error: "Failed to report usage" }, { status: 500 });
  }
}

// const trackInvites = async (subscriptionId: string, totalInvites: number) => {
//     if (totalInvites <= 50) return; // First 50 invites are free

//     try {
//       await fetch("/api/report-usage", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ subscriptionId, extraInvites: totalInvites - 50 }), // Report only extra invites
//       });
//     } catch (error) {
//       console.error("Failed to report usage:", error);
//     }
//   };
