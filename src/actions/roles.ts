"use server";

import { Logger } from "@/lib/logger";
import type { TRole } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

export const find = async (): Promise<TRole[]> => {
  const logger = new Logger(`[ServerActions]:[Invites find]: `);

  try {
    return await prisma.roles.findMany();
  } catch (error) {
    logger.error("Error fetching roles", JSON.stringify(error, null, 2));

    throw error;
  }
};

export const createRole = async (role: TRole): Promise<TRole> => {
  const logger = new Logger(`[ServerActions]:[Role create]: `);

  try {
    const result = await prisma.roles.create({ data: role });

    return result;
  } catch (error) {
    logger.error("Error creating roles", JSON.stringify(error, null, 2));

    throw error;
  }
};
