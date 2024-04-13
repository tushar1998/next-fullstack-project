import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";

import { getUserSubscription } from "@/actions/subscription";
import BillingForm from "@/components/client/billing-form";
import { nextAuthOptions } from "@/lib/next-auth";

export default async function Billing() {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user.id || !session?.org.id) {
    redirect("/");
  }

  const subscription = await getUserSubscription(session?.user.id, session?.org.id);

  if (subscription?.subscription) {
    return <BillingForm {...subscription} />;
  }

  return <p>Something went wrong</p>;
}
