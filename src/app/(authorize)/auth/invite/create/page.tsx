import React from "react";
import RegisterInviteUser from "./register-invite-user";
import { PageProps } from "@/types/page";
import { prisma } from "@/lib/prisma";

async function RegisterUserWithSocialOrEmail({ searchParams }: PageProps) {
  if (!searchParams?.user_id) {
    throw new Error("Invalid user or Invitation user not found");
  }

  const user = await prisma.users.findUnique({ where: { id: searchParams?.user_id } });

  if (!user) {
    throw new Error("User not found");
  }

  return <RegisterInviteUser user={user} />;
}

export default RegisterUserWithSocialOrEmail;
