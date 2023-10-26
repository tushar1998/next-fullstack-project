import React from "react";
import { findOrgUsers } from "@/actions/find-org-users";
import { getInvites } from "@/actions/invite";
import { find as findPermissions } from "@/actions/permissions";
import { find } from "@/actions/roles";
import { dehydrate, Hydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import { PageProps } from "@/types/page";
import { PERMISSIONS } from "@/lib/constants/permissions";
import getQueryClient from "@/lib/getQueryClient";
// import OrganizationMemberAdd from "@/components/client/org-member-add";
// import OrganizationTeam from "@/components/client/org-team";
// import OrganizationTeamBreadCrumb from "@/components/client/org-team-breadcrumb"
import { PageProvider } from "@/components/client/context/page-ctx";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import OrganizationMemberAdd from "@/components/client/org-member-add";
import OrganizationTeam from "@/components/client/org-team";

const hasAccess = (per: string, permissions: string[]) => {
  return !!permissions.includes(per);
};

export default async function OrganizationMembers({ params, searchParams }: PageProps) {
  const session = await getServerSession(nextAuthOptions);

  const queryClient = getQueryClient();
  const currentTab = searchParams?.tab ?? "members";

  if (currentTab === "members") {
    await queryClient.prefetchQuery(["organization-users"], () => findOrgUsers(params?.orgId));
  }

  if (currentTab === "invites" && session?.org.id) {
    await queryClient.prefetchQuery(["invite-users"], () => getInvites(session?.org.id as string));
  }

  await queryClient.prefetchQuery(["roles"], () => find());
  const dehydratedState = dehydrate(queryClient);

  const permissions = await findPermissions(session?.role?.id as string, ["invites", "members"]);

  const permissionArr = permissions.map((per) => per?.permissions?.name);

  const teamRolePermissions = {
    createInvite: hasAccess(PERMISSIONS.INVITES_CREATE, permissionArr),
    removeMember: hasAccess(PERMISSIONS.MEMBERS_DELETE, permissionArr),
    updateRole: hasAccess(PERMISSIONS.MEMBER_UPDATE, permissionArr),
    deleteInvite: hasAccess(PERMISSIONS.INVITES_DELETE, permissionArr),
  };

  return (
    <section className="mx-auto grid w-full max-w-screen-lg items-center gap-4 p-4 sm:px-8">
      <PageProvider permissions={teamRolePermissions}>
        <Hydrate state={dehydratedState}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Teams</h2>

            <OrganizationMemberAdd />
          </div>
          <OrganizationTeam tab={currentTab} />
        </Hydrate>
      </PageProvider>
    </section>
  );
}
