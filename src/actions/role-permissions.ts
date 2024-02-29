"use server";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const findRolePermissions = async () => {
  const logger = new Logger("ServerActions:Find all Role Permissions");
  try {
    const permissions = await prisma.rolePermissions.findMany({
      include: { permissions: true, role: true },
    });

    return permissions;
  } catch (error) {
    logger.log("Failed to fetch role-permissions", JSON.stringify(error, null, 2));

    throw error;
  }
};

export type CreateRolePermission = { role_id: string; permission_id: string };

export const createRolePermission = async ({ role_id, permission_id }: CreateRolePermission) => {
  const logger = new Logger("ServerActions:Create Role Permissions");
  try {
    const permissions = await prisma.rolePermissions.create({
      data: {
        permission_id,
        role_id,
      },
    });

    return permissions;
  } catch (error) {
    logger.log("Failed to create role-permissions", JSON.stringify(error, null, 2));

    throw error;
  }
};
