"use client";

import React, { useMemo } from "react";
import { getInvites } from "@/actions/invite";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { isAfter } from "date-fns";

import { TInvite } from "@/lib/prisma";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Checkbox } from "../ui/checkbox";
import { ReactTable, ReactTableLoading } from "../ui/table";
import InviteActions from "./invite-actions";
import { useServerSession } from "./context/session-ctx";
import Conditional from "../server/conditional";

export default function OrgInviteTable() {
  const { org } = useServerSession();

  const { data, isLoading } = useQuery(["invite-users"], () => getInvites(org?.id as string));

  const columns = useMemo(
    (): ColumnDef<TInvite, string>[] => [
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
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue, row }) => {
          const value = getValue();
          const isExpired = isAfter(new Date(), row.original?.expires_at);

          return (
            <div className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarFallback className="border-[1.5px] border-dashed	border-muted-foreground bg-transparent"></AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="truncate">{value}</span>
                <span className="text-xs text-muted-foreground">
                  <Conditional satisfies={isExpired}>
                    <p>Expired</p>
                    <p>Pending...</p>
                  </Conditional>
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "role",
        accessorKey: "role.display_name",
        header: "Role",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return <InviteActions {...row} />;
        },
      },
    ],
    []
  );

  return (
    <Conditional satisfies={isLoading}>
      <ReactTableLoading />
      <ReactTable<TInvite> data={data ?? []} columns={columns} />
    </Conditional>
  );
}
