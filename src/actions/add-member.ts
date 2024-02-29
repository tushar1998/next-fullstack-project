"use server";

import { Logger } from "@/lib/logger";
import type { TInvite } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

export interface AddMemberParams {
  /** organization where he is invited - ObjectId */
  org_id: string;

  /** Role given of invitee - ObjectId */
  role_id: string;

  /** Invitee email */
  email: string;

  /** Invited By user id - ObjectId */
  invited_by: string;
}

export const addMember = async ({
  email,
  org_id,
  role_id,
  invited_by,
}: AddMemberParams): Promise<TInvite | undefined> => {
  const logger = new Logger(`ServerAction: ${addMember.name}`);

  const expiryDays = parseInt(process.env.INVITE_EXPIRY_DAYS as string, 10);

  const date = new Date();
  date.setDate(date.getDate() + expiryDays);

  try {
    //* Permission: check if the current user has authority to add the role - Frontend form validation

    //* Validation: check current invite with email-address exists - Frontend form validation

    //* Validation: check current invite email-address user exists in current org - Frontend form validation

    //* Validation: check for singleton roles
    const role = await prisma.roles.findUnique({ where: { id: role_id } });

    if (!role) {
      throw new Error("Role not found");
    }

    if (role.singleton === true) {
      const orgUser = await prisma.orgUsers.findFirst({
        where: { org_id, role_id },
      });

      if (orgUser) {
        throw new Error("Role is singleton, cannot create multiple roles");
      }
    }

    //* Action: create invite
    const createdInvite = await prisma.invites.create({
      data: { email, org_id, role_id, invited_by, expires_at: date },
    });

    // "/auth/invite?invitation=`${createdInvite}`

    // email notification //* Implementation pending
    // activity log //* Implementation pending

    return createdInvite;
  } catch (error) {
    logger.error("Error creating Invite", JSON.stringify(error, null, 2));

    throw error;
  }
};
