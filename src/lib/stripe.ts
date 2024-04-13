import Stripe from "stripe";

import type { SubscriptionPlan } from "@/types/subscription";

import { env } from "./env.mjs";

export const stripe = new Stripe(env.NEXT_PUBLIC_STRIPE_API_KEY, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "some description of free plan",
  price_id: "",
};

export const premiumPlan: SubscriptionPlan = {
  name: "Premium",
  description: "some description of premium plan",
  price_id: env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
};
