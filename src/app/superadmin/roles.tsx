"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { find } from "@/actions/roles";

export default function RolesSuperAdmin() {
  const { data: roles } = useQuery(["roles"], () => find());
  return (
    <div>
      <h1 className="mb-2 text-3xl">Roles</h1>
      {roles?.map((role) => {
        return (
          <p key={role.id}>
            {role.display_name}: {role.id}
          </p>
        );
      })}
    </div>
  );
}
