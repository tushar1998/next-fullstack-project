"use client";

import React, { useState } from "react";
import { updateRole } from "@/actions/org-user";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

import { SelectOptions } from "@/types/nav";
import { TOrganizationUsers } from "@/lib/prisma";

import { SelectInput } from "../ui/select";
import { useServerSession } from "./context/session-ctx";
import { usePage } from "./context/page-ctx";
import Conditional from "../server/conditional";
import { Popup } from "../ui/popover";

interface OrgMemberUpdateStatusProps {
  row: Row<TOrganizationUsers>;
  roles: SelectOptions[];
}

export default function OrgMemberUpdateStatus({ row, roles }: OrgMemberUpdateStatusProps) {
  const { user, role: sessionRole } = useServerSession();

  const queryClient = useQueryClient();

  const [role, setRole] = useState<string>(row.original?.role_id);

  const { permissions } = usePage();

  const onSubmit = (roleValue?: string) => {
    if (roleValue) {
      setRole(roleValue);
      updateRole(roleValue, row?.original?.id);
    }

    queryClient.invalidateQueries(["organization-users"]);
  };

  const nonUpdateCondition =
    permissions?.updateRole === false ||
    row?.original?.user_id === user?.id ||
    !sessionRole?.perform_action_on?.includes(row?.original?.role?.name ?? "");

  if (nonUpdateCondition) {
    return <div className="truncate capitalize">{row.getValue("role")}</div>;
  }

  return (
    <Conditional satisfies={permissions?.updateRole}>
      <Popup
        trigger={<div className="truncate capitalize hover:underline">{row.getValue("role")}</div>}
      >
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Edit</h4>
          <p className="text-sm text-muted-foreground">Update the staus for the user</p>

          <SelectInput
            name="role"
            value={role}
            options={roles}
            placeholder="Select a role"
            onChange={onSubmit}
          />
        </div>
      </Popup>
    </Conditional>
  );
}
