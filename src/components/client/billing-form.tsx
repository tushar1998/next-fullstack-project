"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TSubsctiption } from "@/lib/prisma";
import { premiumPlan, stripe } from "@/lib/stripe";
import { getAbsoluteUrl } from "@/lib/utils";

import { Button } from "../ui/button";
import { useServerSession } from "./context/session-ctx";

type BillingFormProps = {
  isPremium: boolean;
  subscription: TSubsctiption;
};

export default function BillingForm({ isPremium, subscription }: BillingFormProps) {
  const session = useServerSession();

  const billingUrl = getAbsoluteUrl(`/org/${session?.org.name}/billing`);

  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = async () => {
    let stripeSession;

    if (isPremium && subscription?.customer_id) {
      stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscription.customer_id,
        return_url: billingUrl,
      });
    }

    if (!isPremium) {
      stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        success_url: billingUrl,
        cancel_url: billingUrl,
        billing_address_collection: "required",
        customer_email: session.user.email,
        currency: "inr",
        line_items: [
          {
            price: premiumPlan.price_id,
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
          orgId: session.org.id as string,
        },
      });
    }

    if (stripeSession && stripeSession.url) {
      window.location.href = stripeSession.url;
    }

    toast.error("Something went wrong");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button>{isPremium ? "Manage Subscription" : "Upgrade to Premium"}</Button>
      </form>
    </FormProvider>
  );
}

/**
 * <form onSubmit={onSubmit}>
        <button type="submit" className={buttonVariants({ variant: "default" })}>
          {subscription?.isPremium ? "Manage Subscription" : "Upgrade to Premium"}
        </button>
      </form>
 */
