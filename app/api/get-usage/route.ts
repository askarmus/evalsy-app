import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    // Get the latest invoice
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 1, // Get the most recent invoice
    });

    if (invoices.data.length === 0) {
      return NextResponse.json({ totalCharge: 0, extraInvites: 0 });
    }

    // Get total charge for extra invites
    const latestInvoice = invoices.data[0];
    const extraInvitesCharge = latestInvoice.lines.data.find((item) => item.price?.id === "price_1R3btRPcvZoiNWtPkOZJUzCu");

    return NextResponse.json({
      totalCharge: latestInvoice.total / 100, // Convert cents to dollars
      extraInvites: extraInvitesCharge ? extraInvitesCharge.quantity : 0,
    });
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}
