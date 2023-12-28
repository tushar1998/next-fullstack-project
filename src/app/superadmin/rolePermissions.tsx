"use client"

import React from "react"
import { findRolePermissions } from "@/actions/role-permissions"
import { useQuery } from "@tanstack/react-query"
import sortBy from "lodash/sortBy"

export default function RolePermissionSuperAdmin() {
  const { data } = useQuery(["role-permissions"], () => findRolePermissions())

  const rolePermissions = sortBy(data, (value) => {
    return value.role.display_name
  })

  return (
    <div>
      <h1 className="mb-2 text-3xl">Role Permissions</h1>
      {rolePermissions?.map((rp, index, array) => {
        const curr = array[index]?.role.display_name
        const prev = array[index - 1]?.role.display_name

        return (
          <div key={rp?.id}>
            {prev !== curr ? <p>{curr}</p> : null}
            <p className="ml-6">{rp?.permissions?.display_name}</p>
          </div>
        )
      })}
    </div>
  )
}
