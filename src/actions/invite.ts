"use server"

import { Logger } from "@/lib/logger"
import { prisma, TInvite } from "@/lib/prisma"

export const getInvites = async (org_id: string) => {
  const logger = new Logger(`[ServerAction: Get Invitations]:`)

  try {
    const invites = await prisma.invites.findMany({
      where: {
        org_id,
      },
      include: {
        role: true,
      },
    })

    return invites
  } catch (error) {
    logger.error("Failed to fetch Invites", JSON.stringify(error, null, 2))

    throw error
  }
}

export const acceptInvitation = async (invitation: TInvite) => {
  const logger = new Logger(`[ServerAction: Accept Invitation]:`)

  try {
    //! Permission - check if user has permission to
    //* Validation: Expiry Check - Frontend Takes care
    //* Validation: Check if user exists in system - Frontend Takes care
    //* Validation: Check if user exists in current org - Frontend Takes care
    return await prisma.$transaction(async (tx) => {
      let newUser = await tx.users.findUnique({
        where: { email: invitation?.email },
      })

      if (!newUser) {
        //* Action: Create user if user does not exists in system
        newUser = await tx.users.create({
          data: { email: invitation?.email, name: invitation?.email },
        })
      }

      //* Action: Create orgUser of the new created user
      const orgUser = await tx.orgUsers.create({
        data: {
          org_id: invitation.org_id,
          role_id: invitation.role_id,
          user_id: newUser.id,
        },
      })

      await tx.invites.delete({ where: { id: invitation?.id } })

      return orgUser
    })
  } catch (error) {
    logger.error(
      "Failed to create user or org user",
      JSON.stringify(error, null, 2)
    )

    throw error
  }
}

export const declineInvitation = async (id: string) => {
  const logger = new Logger(`ServerAction: ${declineInvitation.name}`)

  try {
    const deleteInvite = await prisma.invites.delete({
      where: {
        id,
      },
    })

    return deleteInvite
  } catch (error) {
    logger.error("Failed to decline invitation", JSON.stringify(error, null, 2))

    throw error
  }
}

export const resendInvite = async (invite_id: string) => {
  const logger = new Logger(`[ServerAction: Resend Invitation]:`)

  const expiryDays = parseInt(process.env.INVITE_EXPIRY_DAYS as string, 10)

  const date = new Date()
  date.setDate(date.getDate() + expiryDays)

  try {
    //* Permission: invites:create: check if the current user has authority to add the role - Frontend permission check
    //* Validation: check current invite with email-address is not expired - Frontend check
    //* Validation: check current invite email-address user exists in current org - Frontend check

    const invite = await prisma.invites.update({
      where: { id: invite_id },
      data: {
        expires_at: date,
      },
    })

    return invite
  } catch (error) {
    logger.error("Failed to Resend Invite", JSON.stringify(error, null, 2))
  }
}
