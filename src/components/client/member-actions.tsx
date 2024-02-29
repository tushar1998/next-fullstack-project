"use client";

import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { removeUser } from "@/actions/org-user";
import type { TOrganizationUsers } from "@/lib/prisma";

import Conditional from "../server/conditional";
import { Button } from "../ui/button";
import { Modal } from "./common/modal";
import { usePage } from "./context/page-ctx";

interface MemberActionsProps extends Row<TOrganizationUsers> {}

function MemberActions({ original }: MemberActionsProps) {
  const { permissions } = usePage();

  const [opened, { toggle, close }] = useDisclosure();

  // const { toast } = useToast()

  const { invalidateQueries } = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: string) => removeUser(variables),
    onSuccess: () => {
      toast.success("Member removed successfully");
    },
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
            className="size-8 p-0"
            loading={isLoading}
            onClick={toggle}
          >
            <span className="sr-only">Remove Member</span>
            <Trash2 className="size-4" />
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
