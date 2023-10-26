"use server"

import { prisma } from "@/lib/prisma"

export const findOrganization = async (name: string) => {
  return prisma.organizations.findUnique({ where: { name } })
}
