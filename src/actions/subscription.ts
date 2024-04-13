"use server";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { freePlan, premiumPlan } from "@/lib/stripe";

export const getUserSubscription = async (user_id: string, org_id: string) => {
  const logger = new Logger(`Server Action: getUserSubscription`);

  try {
    const orgUser = await prisma.orgUsers.findFirst({
      where: { user_id, org_id },
    });

    if (!orgUser) {
      logger.error("Organization user not found");

      throw new Error("Organization user not found");
    }

    const subscription = await prisma.subscription.findUnique({
      where: { org_id: orgUser?.org_id },
    });

    if (!subscription) {
      logger.info("Subscription not found");

      return { plan: freePlan, subscription: null, isPremium: false };
    }

    // Check if premium
    const isPremium =
      (subscription?.period_end && subscription.period_end.getTime() + 86_400_000 > Date.now()) ??
      false;

    const plan = isPremium ? premiumPlan : freePlan;

    return { plan, subscription, isPremium };
  } catch (error) {
    logger.error("User or Subscription", JSON.stringify(error, null, 2));

    throw error;
  }
};
