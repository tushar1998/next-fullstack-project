"use client"

import React, { useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import OrgInviteTable from "./org-invite-table"
import OrganizationMemberTable from "./org-member-table"

interface OrganizationTeamProps {
  tab?: string
}

export default function OrganizationTeam({ tab }: OrganizationTeamProps) {
  const [currentTab, setTab] = useState(tab)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useRef(new URLSearchParams(searchParams)).current

  return (
    <Tabs
      value={currentTab}
      className="mx-auto w-full overflow-auto"
      onValueChange={(value) => {
        params.set("tab", value)
        router.push(`${pathname}?${params.toString()}`)
        setTab(value)
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invites">Invites</TabsTrigger>
      </TabsList>
      <TabsContent value="members" className="w-full">
        <OrganizationMemberTable />
      </TabsContent>
      <TabsContent value="invites">
        <OrgInviteTable />
      </TabsContent>
    </Tabs>
  )
}
