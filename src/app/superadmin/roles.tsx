"use client"

import React from "react"
import { find } from "@/actions/roles"
import { useQuery } from "@tanstack/react-query"

export default function RolesSuperAdmin() {
  const { data: roles } = useQuery(["roles"], () => find())
  return (
    <div>
      <h1 className="mb-2 text-3xl">Roles</h1>
      {roles?.map((role) => {
        return (
          <p key={role.id} className="text-md">
            {role.display_name}: {role.id}
          </p>
        )
      })}
    </div>
  )
}
