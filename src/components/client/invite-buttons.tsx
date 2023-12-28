"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { acceptInvitation, declineInvitation } from "@/actions/invite";
import { useMutation } from "@tanstack/react-query";

import { TInvite } from "@/lib/prisma";

import { Button } from "../ui/button";
import { toast } from "sonner";

interface InvitationButtonsProps {
  invitation: TInvite;
}

export default function InvitationButtons({ invitation }: InvitationButtonsProps) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
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

  const { mutate: mutateDecline, isLoading: isLoadingDecline } = useMutation({
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
      <Button className="w-full" loading={isLoading} onClick={() => mutate(invitation)}>
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
