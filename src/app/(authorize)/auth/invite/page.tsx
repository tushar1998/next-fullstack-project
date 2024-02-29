import { isAfter } from "date-fns";
import { Network, Plus } from "lucide-react";
import type { ReactNode } from "react";
import React from "react";

import InvitationButtons from "@/components/client/invite-buttons";
import Conditional from "@/components/server/conditional";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TInvite, TUser } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { getShortName } from "@/lib/utils";
import type { PageProps } from "@/types/page";

export default async function InvitePage({ searchParams }: Readonly<PageProps>) {
  const invitationId = (searchParams?.invitation as string) ?? "";

  const invitation: TInvite | null = await prisma.invites.findUnique({
    where: { id: invitationId },
    include: { user: true, org: true },
  });

  let children: ReactNode;

  if (!invitation) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className="w-72 text-center text-lg">Invitation Not Found</h1>
      </div>
    );
  }

  const invitedUser: TUser | null = await prisma.users.findUnique({
    where: { email: invitation?.email },
  });

  const isExpired = invitation?.expires_at ? isAfter(new Date(), invitation?.expires_at) : false;

  /**
   * use cases
   * - Invited user already in system i.e: Invitation in another organization
   *    - Add to orgUser with role
   * - Invited user is a new user i.e: Invitation to new user in the organization
   *    - Add to
   */

  if (isExpired) {
    children = <h1 className="w-72 text-center text-lg">Invitation Expired</h1>;
  } else {
    children = (
      <>
        <div className="flex items-center gap-3">
          <Conditional satisfies={invitedUser}>
            <>
              <Avatar className="size-10">
                <AvatarImage src={invitedUser?.image as string} alt={invitedUser?.name as string} />
                <AvatarFallback>{getShortName(invitedUser?.name)}</AvatarFallback>
              </Avatar>
              <Plus className="size-8" />
            </>
          </Conditional>

          <Network className="size-10" />
        </div>
        <h1 className="w-72 text-center text-lg">
          <span className="font-extrabold">{invitation?.user?.name}</span> has
          <span className="font-extralight"> invited you to </span>
          <span className="font-extrabold">{invitation?.org?.display_name}</span>
        </h1>

        <InvitationButtons invitation={invitation} />
      </>
    );
  }

  return <div className="flex flex-col items-center gap-4">{children}</div>;
}
