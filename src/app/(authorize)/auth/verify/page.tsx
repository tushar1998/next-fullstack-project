import React from "react";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type { PageProps } from "@/types/page";

import VerifyButton from "./verify-button";

async function Verify({ searchParams }: PageProps) {
  // ? Check user is already a user in system by checking the email ID

  const logger = new Logger("Verification");

  const registerId = searchParams?.registration;
  const registration = await prisma.register.findUnique({
    where: { id: registerId },
  });

  if (!registration) {
    return <>Registration Not found</>;
  }

  const user = await prisma.users.findFirst({
    where: { email: registration?.email },
  });

  if (user) {
    return <>User has already registered. Invalid verify Registration</>;
  }

  const verifyEmail = await prisma.register.update({
    where: { id: registerId },
    data: { email_verified: true },
  });

  // eslint-disable-next-line
  const { email_verified, ...userDetails } = verifyEmail;

  await prisma.users.create({
    data: userDetails,
  });

  logger.log("Signup successful redirecting /auth/create");

  return <VerifyButton registration={registration} />;
}

export default Verify;
