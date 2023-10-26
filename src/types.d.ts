import type { Account, DefaultSession } from "next-auth";

import { TOrganization, TRole } from "./lib/prisma";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: {
      id: string;
      user_id: string;
      email: string;
      name: string;
      image: string;
    };
    auth: Partial<Account>;
    org: Partial<TOrganization>;
    role: Partial<TRole>;
  }
}
