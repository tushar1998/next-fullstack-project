"use client";

import React from "react";
import { removeUser } from "@/actions/org-user";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

import { TOrganizationUsers } from "@/lib/prisma";

import { Button } from "../ui/button";
import { usePage } from "./context/page-ctx";
import Conditional from "../server/conditional";
import { Modal } from "./common/modal";
import { Trash, Trash2 } from "lucide-react";

interface MemberActionsProps extends Row<TOrganizationUsers> {}

function MemberActions({ original }: MemberActionsProps) {
  const { permissions } = usePage();

  const [opened, { toggle, close }] = useDisclosure();

  // const { toast } = useToast()

  const { invalidateQueries } = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: string) => removeUser(variables),
    onSuccess: () => {},
    // toast({ variant: "success", title: "Member removed successfully" }),
    onSettled() {
      invalidateQueries(["organization-users"]);
      close();
    },
  });

  return (
    <Conditional satisfies={permissions?.removeMember}>
      <Modal open={opened} onOpenChange={toggle}>
        <Modal.Button asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            loading={isLoading}
            onClick={toggle}
          >
            <span className="sr-only">Remove Member</span>
            <Trash2 className="h-4 w-4" />
          </Button>
        </Modal.Button>

        <Modal.Content title="Remove Member">
          <span className="text-sm">
            This action cannot be undone. This will remove the user from the current organization
          </span>
          <Modal.Footer>
            <Button loading={isLoading} onClick={() => mutate(original?.id)}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Conditional>
  );
}

export default MemberActions;
