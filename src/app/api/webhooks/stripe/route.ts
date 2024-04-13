import { headers } from "next/headers";
import type Stripe from "stripe";

import { env } from "@/lib/env.mjs";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new Response(`Webhook Error: ${JSON.stringify(error, null, 2)}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await prisma.subscription.update({
      where: {
        org_id: session?.metadata?.orgId,
      },
      data: {
        subscription_id: subscription.id,
        customer_id: subscription.customer as string,
        price_id: subscription.items.data[0].price.id,
        period_end: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Update the price id and set the new period end.
    await prisma.subscription.update({
      where: {
        subscription_id: subscription.id,
      },
      data: {
        price_id: subscription.items.data[0].price.id,
        period_end: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  return new Response(null, { status: 200 });
}
