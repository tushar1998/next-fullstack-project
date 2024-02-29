import React from "react";

import { prisma } from "@/lib/prisma";
import type { PageProps } from "@/types/page";

import RegisterInviteUser from "./register-invite-user";

async function RegisterUserWithSocialOrEmail({ searchParams }: Readonly<PageProps>) {
  if (!searchParams?.user_id) {
    throw new Error("Invalid user or Invitation user not found");
  }

  const user = await prisma.users.findUnique({
    where: { id: searchParams?.user_id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return <RegisterInviteUser user={user} />;
}

export default RegisterUserWithSocialOrEmail;
