import React from "react"
import { findPermissions } from "@/actions/permissions"
import { findRolePermissions } from "@/actions/role-permissions"
import { find } from "@/actions/roles"
import { dehydrate, Hydrate } from "@tanstack/react-query"

import getQueryClient from "@/lib/getQueryClient"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import PermissionsSuperAdmin from "./permissions"
import RolePermissionForms from "./role-pers"
import RolePermissionSuperAdmin from "./rolePermissions"
import RolesSuperAdmin from "./roles"

export default async function SuperAdmin() {
  /**
   * Crud Roles
   * Crud Permissions
   * Crud Roles-Permissions
   */

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(["roles"], () => find())
  await queryClient.prefetchQuery(["permissions"], () => findPermissions())
  await queryClient.prefetchQuery(["role-permissions"], () =>
    findRolePermissions()
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <div className="hidden justify-between lg:flex">
        <RolePermissionForms />
        <div className="border"></div>

        <Accordion type="multiple" className="mx-auto w-full max-w-xl p-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Roles</AccordionTrigger>
            <AccordionContent>
              <RolesSuperAdmin />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Permissions</AccordionTrigger>
            <AccordionContent>
              <PermissionsSuperAdmin />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Roles Permissions</AccordionTrigger>
            <AccordionContent>
              <RolePermissionSuperAdmin />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="lg:hidden">Screen not supported on Mobile devices</div>
      {/* <h1 className="text-3xl">Role Permissions</h1> */}
    </Hydrate>
  )
}
