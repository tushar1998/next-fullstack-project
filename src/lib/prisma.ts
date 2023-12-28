import {
  invites,
  organizations,
  orgUsers,
  permissions,
  Prisma,
  PrismaClient,
  register,
  rolePermissions,
  roles,
  users,
} from "@prisma/client";
import merge from "lodash/merge";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClient = globalForPrisma.prisma ?? new PrismaClient();

export type FindQuery<A = unknown, T = unknown> = {
  args: Prisma.Exact<A, Prisma.Args<T, "count">>;
};

//! Need to find solution for types in prisma
// @ts-ignore
const findQuery = ({ query, args }: unknown) => {
  args.where = merge(args.where, { deleted: false });
  return query(args);
};

export const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      count: findQuery,
      findUnique: findQuery,
      findFirst: findQuery,
      findMany: findQuery,
      findFirstOrThrow: findQuery,
      update: ({ args, query }) => {
        args.data = merge(args.data, { updated_at: new Date(Date.now()) });
        return findQuery({ args, query });
      },
      updateMany: ({ args, query }) => {
        args.data = merge(args.data, { updated_at: new Date(Date.now()) });
        return findQuery({ args, query });
      },
      aggregate: ({ args, query }) => {
        args.where = merge(args.where, { deleted: false });
        return query(args);
      },
      aggregateRaw: ({ args, query }) => {
        args.pipeline?.unshift({ $match: { deleted: false } });

        return query(args);
      },
      // aggregateRaw: () => {},
      delete: ({ args, model }) => {
        args.where = merge(args.where, { deleted: false });

        const prismaModel = prismaClient[model];

        //! Need to find solution for types in prisma
        // @ts-ignore
        return prismaModel.update({
          where: args.where,
          data: { deleted_at: new Date(Date.now()), deleted: true },
        });
      },
      deleteMany: ({ args, model }) => {
        args.where = merge(args.where, { deleted_at: Date.now() });

        const prismaModel = prismaClient[model];

        //! Need to find solution for types in prisma
        // @ts-ignore
        return prismaModel.updateMany({
          where: args.where,
          data: { deleted_at: new Date(Date.now()), deleted: true },
        });
      },
    },
  },
}) as typeof prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

type TOrganizationUser = orgUsers & {
  org?: organizations;
  role?: roles;
  user?: users;
};

interface TRolePermissions extends rolePermissions {
  permissions: permissions;
}
interface TRole extends roles {}
interface TUser extends users {}
type TInvite = invites & { user?: users; org?: organizations };
type TRegister = register;

export type {
  TOrganizationUser as TOrganizationUsers,
  organizations as TOrganization,
  TRegister,
  TRole,
  TUser,
  TInvite,
  TRolePermissions,
};
