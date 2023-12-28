"use client";

import React from "react";
import { addMember, AddMemberParams } from "@/actions/add-member";
import { findOrgUserWithEmail } from "@/actions/find-org-users";
import { getInvite } from "@/actions/get-invite";
import { find } from "@/actions/roles";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import { TRole } from "@/lib/prisma";
import { SelectInput } from "@/components/ui/select";
import { Modal } from "@/components/client/common/modal";

import { Button } from "../ui/button";
import { Form, FormInput } from "../ui/form";
import { Input } from "../ui/input";
// import { useToast } from "../ui/use-toast";
import { useServerSession } from "./context/session-ctx";
import { usePage } from "./context/page-ctx";
import Conditional from "../server/conditional";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddMemberForm {
  email: string;
  role: string;
}

export default function OrganizationMemberAdd() {
  const { user, org, role } = useServerSession();

  const { permissions } = usePage();

  const [opened, { close, toggle }] = useDisclosure(false);
  // const { toast } = useToast();

  const { data: roles, isLoading: rolesLoading } = useQuery(["roles"], () => find(), {
    enabled: !!role,
    select: (selectRoles) => {
      const rolesByName = selectRoles.reduce((prev: Record<string, TRole>, next) => {
        prev[next.name] = { ...next };

        return prev;
      }, {});

      if (role) {
        return role?.perform_action_on?.map((role) => ({
          label: rolesByName[role]?.display_name,
          value: rolesByName[role]?.id,
        }));
      }
    },
  });

  const methods = useForm<AddMemberForm>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  const { handleSubmit, reset } = methods;

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: AddMemberParams) => addMember(variables),
    onSuccess: () => {
      close();
      reset();
      toast.success("Invitation sent successfully");
    },
    onError: () => {
      toast.error("Invitation send failed");
    },

    onSettled: close,
  });

  const onSubmit: SubmitHandler<AddMemberForm> = (values) => {
    if (!org?.id || !user.id) {
      console.error("Org Id or User not found");
      return;
    }

    mutate({
      email: values.email,
      role_id: values.role,
      org_id: org?.id,
      invited_by: user.id,
    });
  };

  const onError: SubmitErrorHandler<AddMemberForm> = (errors) => {
    console.error("Error in Form", errors);
  };

  const validateEmail = async (value: string) => {
    if (value.trim() === user?.email) {
      return "User cannot invite self";
    }
    const invite = await getInvite(value);

    if (invite) {
      return "User Invite already exists";
    }

    const orgUser = await findOrgUserWithEmail(value, org?.id);

    if (orgUser) {
      return "User already exists in organization";
    }
  };

  return (
    <Conditional satisfies={permissions?.createInvite}>
      <Modal
        onOpenChange={(open) => {
          if (!open) reset();

          toggle();
        }}
        open={opened}
      >
        <Modal.Button asChild>
          <Button
            className="flex items-center gap-2"
            loading={rolesLoading || !role}
            onClick={toggle}
          >
            <Plus className="h-4 w-4 text-current" />
            Add Member
          </Button>
        </Modal.Button>

        <Modal.Content
          title="Add Member"
          description="Invite a member. Click send when you're done."
          // onClose={close}
        >
          <Form {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate
              id="add-member"
              className="space-y-4"
            >
              <FormInput
                name="email"
                label="Email"
                description="The email entered should be associated with Google"
                rules={{
                  required: { value: true, message: "Email field is required" },
                  validate: validateEmail,
                }}
              >
                <Input placeholder="Enter email" type="email" />
              </FormInput>
              <Conditional satisfies={roles}>
                <FormInput
                  name="role"
                  label="Role"
                  rules={{
                    required: { value: true, message: "Role is required" },
                  }}
                >
                  <SelectInput options={roles} placeholder="Select a role" />
                </FormInput>
              </Conditional>
            </form>
          </Form>

          <Modal.Footer>
            <Button variant="outline" onClick={close} loading={isLoading}>
              Cancel
            </Button>
            <Button type="submit" form="add-member" loading={isLoading}>
              Send Invite
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Conditional>
  );
}
