"use server"

import { Logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

export const getInvite = async (email: string) => {
  const logger = new Logger(`ServerAction: ${getInvite.name}`)
  try {
    const invite = await prisma.invites.findFirst({ where: { email } })

    return invite
  } catch (error) {
    logger.error("Failed to fetch Invite", JSON.stringify(error, null, 2))

    throw error
  }
}
