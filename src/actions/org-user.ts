"use server";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export const updateRole = async (role_id: string, id: string) => {
  const logger = new Logger(`ServerActions: Delete OrgUser`);

  try {
    const user = await prisma.orgUsers.update({
      where: { id },
      data: { role_id },
    });

    return user;
  } catch (error) {
    logger.error("Failed to delete org user", JSON.stringify(error, null, 2));

    throw error;
  }
};

export const removeUser = async (id: string) => {
  const logger = new Logger(`ServerActions: Delete OrgUser`);

  try {
    const user = await prisma.orgUsers.delete({ where: { id } });

    return user;
  } catch (error) {
    logger.error("Failed to delete org user", JSON.stringify(error, null, 2));

    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  const logger = new Logger(`ServerActions: Find User`);

  try {
    const response = await prisma.users.findUnique({ where: { email } });

    return response;
  } catch (error) {
    logger.error("Failed to find user", JSON.stringify(error, null, 2));

    throw error;
  }
};
