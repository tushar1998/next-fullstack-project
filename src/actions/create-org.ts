"use server";

import type { Session } from "next-auth";

import { Logger } from "@/lib/logger";
import type { TOrganizationUsers } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

const logger = new Logger("Server Action: Create Org");

export type CreateOrgParams = {
  name: string;
  display_name: string;
  user: Session["user"];
};

export const createOrg = async ({
  name,
  display_name,
  user,
}: CreateOrgParams): Promise<TOrganizationUsers | void> => {
  try {
    let organization;
    let organizationUser;

    await prisma.$transaction(async (tx) => {
      organization = await tx.organizations.create({
        data: {
          name,
          display_name,
          user_id: user.id,
        },
      });

      const orgOwnerRole = await tx.roles.findUnique({
        where: { name: "owner" },
      });

      if (orgOwnerRole) {
        organizationUser = await tx.orgUsers.create({
          data: {
            org_id: organization.id,
            user_id: user.id,
            role_id: orgOwnerRole.id,
          },
          include: { org: true, role: true },
        });
      }
    });

    return organizationUser;
  } catch (error) {
    logger.error("error creating organization", JSON.stringify(error, null, 2));

    throw error;
  }
};
