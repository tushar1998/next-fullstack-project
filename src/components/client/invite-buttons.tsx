"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { acceptInvitation, declineInvitation } from "@/actions/invite"
import { useMutation } from "@tanstack/react-query"

import { TInvite } from "@/lib/prisma"

import { Button } from "../ui/button"
// import { useToast } from "../ui/use-toast"

interface InvitationButtonsProps {
  invitation: TInvite
}

export default function InvitationButtons({
  invitation,
}: InvitationButtonsProps) {
  // const { toast } = useToast()
  const router = useRouter()
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: TInvite) => acceptInvitation(data),
    onSuccess: () => {
      // toast({ variant: "success", title: "Invitation accepted!" })
      router.push("/")
    },
    onError: () => {
      // toast({ variant: "error", title: "Invitation accept failed!" })
    },
  })

  const { mutate: mutateDecline, isLoading: isLoadingDecline } = useMutation({
    mutationFn: (id: string) => declineInvitation(id),
    onSuccess: () => {
      // toast({ variant: "success", title: "Invitation declined!" })
      router.push("/")
    },
    onError: () => {
      // toast({ variant: "error", title: "Invitation decline failed!" })
    },
  })

  return (
    <>
      <Button
        className="w-full"
        loading={isLoading}
        onClick={() => mutate(invitation)}
      >
        Accept Invitation
      </Button>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => mutateDecline(invitation.id)}
        loading={isLoadingDecline}
      >
        Decline
      </Button>
    </>
  )
}
