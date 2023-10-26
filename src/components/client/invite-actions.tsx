"use client";

import React, { useMemo } from "react";
import { declineInvitation, resendInvite } from "@/actions/invite";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { isAfter } from "date-fns";
import { toast } from "sonner";

import { TInvite } from "@/lib/prisma";

import { Button } from "../ui/button";
import { usePage } from "./context/page-ctx";
import Conditional from "../server/conditional";
import { RefreshCw, Trash2 } from "lucide-react";
import { Modal } from "./common/modal";

interface InviteActionsProps extends Row<TInvite> {}

export default function InviteActions({ original }: InviteActionsProps) {
  const { permissions } = usePage();

  const queryClient = useQueryClient();
  const [opened, { close, open }] = useDisclosure();

  const { mutate } = useMutation({
    mutationFn: async (variables: string) => {
      toast.promise(resendInvite(variables), {
        loading: "Resending Invite...",
        success: "Resend invitation successfull",
        error: "Resend invitation failed",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["invite-users"]);
    },
  });

  const { mutate: mutateMember } = useMutation({
    mutationFn: async (variables: string) => {
      close();
      toast.promise(declineInvitation(variables), {
        loading: "Deleting Invite...",
        success: "Invite deleted successfully",
        error: "Invite deletion failed",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["invite-users"]);
    },

    onSettled: () => {},
  });

  const isExpired = useMemo(
    () => isAfter(new Date(), original?.expires_at),
    [original?.expires_at]
  );

  return (
    <div className="flex items-center gap-2">
      <Conditional satisfies={permissions?.createInvite && isExpired}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => mutate(original?.id)}
        >
          <span className="sr-only">Resend Invite</span>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Conditional>

      <Modal open={opened}>
        <Conditional satisfies={permissions?.deleteInvite}>
          <Modal.Button asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={open}>
              <span className="sr-only">Delete Invite</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Modal.Button>
        </Conditional>

        <Modal.Content
          title="Delete Invite"
          description="Are you sure you want to delete this invite? This action cannot be undone"
        >
          <Modal.Footer>
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => mutateMember(original?.id)}>Delete</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
