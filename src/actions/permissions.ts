"use server"

import { Logger } from "@/lib/logger"
import { prisma, TRolePermissions } from "@/lib/prisma"

export const find = async (
  role_id: string,
  name?: Array<string>
): Promise<TRolePermissions[]> => {
  const logger = new Logger("ServerActions:Find:Permissions")

  try {
    const permissions = await prisma.rolePermissions.findMany({
      where: {
        permissions: {
          scope: { in: name },
        },
        role_id,
      },
      include: {
        permissions: true,
      },
    })

    return permissions
  } catch (error) {
    logger.error("Failed to fetch permission", JSON.stringify(error, null, 2))

    throw error
  }
}

export const findPermissions = async () => {
  const logger = new Logger("ServerActions:Find all Permissions")
  try {
    const permissions = await prisma.permissions.findMany()

    return permissions
  } catch (error) {
    logger.log("Failed to fetch permissions", JSON.stringify(error, null, 2))

    throw error
  }
}

export type CreatePermission = {
  name: string
  scope: string
  display_name: string
}

export const createPermissions = async ({
  name,
  scope,
  display_name,
}: CreatePermission) => {
  const logger = new Logger("ServerActions:Create Permissions")
  try {
    const permissions = await prisma.permissions.create({
      data: { name, display_name, scope },
    })

    return permissions
  } catch (error) {
    logger.log("Failed to create permission", JSON.stringify(error, null, 2))

    throw error
  }
}
