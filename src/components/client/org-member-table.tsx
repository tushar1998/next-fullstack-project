"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { findOrgUsers } from "@/actions/find-org-users";
import { find } from "@/actions/roles";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

import { ROLES } from "@/lib/constants/roles";
import { TOrganizationUsers, TRole } from "@/lib/prisma";
import { getShortName } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ReactTable } from "../ui/table";
import OrgMemberUpdateStatus from "./org-member-update-status";
import Conditional from "../server/conditional";
import { Crown } from "lucide-react";
import { useServerSession } from "./context/session-ctx";
import MemberActions from "./member-actions";

export default function OrganizationMemberTable() {
  const { orgId } = useParams();
  const { user, role } = useServerSession();

  const { data, isLoading } = useQuery<TOrganizationUsers[]>(["organization-users"], () =>
    findOrgUsers(orgId as string)
  );

  const { data: roles } = useQuery(["roles"], () => find(), {
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

  const columns: ColumnDef<TOrganizationUsers, string>[] = useMemo(
    () => [
      {
        id: "checkbox",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "name",
        accessorKey: "user.name",
        header: "Name",
        cell: ({ getValue, row }) => {
          const value = getValue();
          const isOwner = row.original.role?.name === ROLES.OWNER;

          const isYou = row?.original?.user_id === user?.id;

          return (
            <div className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={row.original.user!.image!} alt={value} />
                <AvatarFallback>{getShortName(value)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate">
                    {value} {isYou ? "(You)" : ""}
                  </span>
                  <Conditional satisfies={isOwner}>
                    <Crown color="#ffc300" className="h-3 w-3" />
                  </Conditional>
                </div>
                <span className="text-xs text-muted-foreground">{row.original.user!.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        id: "role",
        accessorKey: "role.display_name",
        header: "Role",
        cell: ({ row }) => <OrgMemberUpdateStatus row={row} roles={roles ?? []} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          if (
            row?.original?.user_id === user?.id ||
            !role?.perform_action_on?.includes(row?.original?.role?.name ?? "")
          ) {
            return <></>;
          }

          return <MemberActions {...row} />;
        },
      },
    ],
    [role?.perform_action_on, roles, user?.id]
  );

  if (isLoading) {
    return <></>;
  }

  // Help Banner for time user
  // https://cdn.dribbble.com/users/1817677/screenshots/19743077/media/48403d7eaf0ff98c0d3074f2c3b68bfc.png

  return <ReactTable<TOrganizationUsers> data={data ?? []} columns={columns} />;
}
