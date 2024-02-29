"use client";

import { useQuery } from "@tanstack/react-query";
import sortBy from "lodash/sortBy";
import React from "react";

import { findPermissions } from "@/actions/permissions";

export default function PermissionsSuperAdmin() {
  const { data: permissions } = useQuery(["permissions"], () => findPermissions());

  const pers = sortBy(permissions, (value) => {
    return value.scope;
  });

  return (
    <div>
      <h1 className="text-3xl">Permissions</h1>
      {pers?.map((p, index, array) => {
        const curr = array[index]?.scope;
        const prev = array[index - 1]?.scope;

        return (
          <div key={p.id}>
            {curr !== prev ? <p className="mt-4 capitalize">{curr}</p> : null}
            <p>
              {p.display_name}: {p.id}
            </p>
          </div>
        );
      })}
    </div>
  );
}
