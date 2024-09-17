"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { acceptInvitation, declineInvitation } from "@/actions/invite";
import type { TInvite } from "@/lib/prisma";

import { Button } from "../ui/button";

interface InvitationButtonsProps {
  invitation: TInvite;
}

export default function InvitationButtons({ invitation }: InvitationButtonsProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TInvite) => acceptInvitation(data),
    onSuccess: (data) => {
      toast.success("Invitation accepted!");

      const searchParams = new URLSearchParams();
      searchParams.append("user_id", data.user_id);

      router.push(`/auth/invite/create?${searchParams.toString()}`);
    },
    onError: () => {
      toast.error("Invitation accept failed!");
    },
  });

  const { mutate: mutateDecline, isPending: isLoadingDecline } = useMutation({
    mutationFn: (id: string) => declineInvitation(id),
    onSuccess: () => {
      toast.success("Invitation declined!");
      router.push("/");
    },
    onError: () => {
      toast.error("Invitation declined failed!");
    },
  });

  return (
    <>
      <Button className="w-full" loading={isPending} onClick={() => mutate(invitation)}>
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
  );
}
