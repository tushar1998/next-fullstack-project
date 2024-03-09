import { compareSync } from "bcryptjs";
import type { NextAuthOptions, User } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

import { env } from "./env.mjs";

const logger = new Logger("NextAuth");

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      async authorize(credentials?: Record<string, string>): Promise<User | null> {
        // ? Find User
        // ? Check if already exists - Frontend check
        // ? Verify providers - google or any other
        // ? Verify Credentials - Passwords
        // ? Generate Token as per sign in with google
        // ? return user
        try {
          if (!credentials) {
            return null;
          }

          const user = await prisma.users.findUnique({
            where: { email: credentials?.email },
          });

          if (!user || !user?.password) return null;

          if (user?.provider === "google") {
            throw new Error("You have already registered with google, select sign in with google");
          }

          let isPasswordCorrect: boolean;

          // User registeration and not logged we perform internal login which provides already hashed password
          const isCredentialPasswordHashed = credentials.hashed;

          if (isCredentialPasswordHashed) {
            isPasswordCorrect = credentials?.password === user.password;
          } else {
            isPasswordCorrect = compareSync(credentials.password, user.password);
          }

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          logger.error("Failed to login", JSON.stringify(error, null, 2));

          return null;
        }
      },
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@acme.com",
        },
        password: { label: "Password", type: "password" },
      },
      name: "Credentials",
    }),
    GoogleProvider({
      clientId: env.GOOGLE_OAUTH_CLIENT as string,
      clientSecret: env.GOOGLE_OAUTH_SECRET as string,
      authorization: {
        params: {
          scope: "email profile openid",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, account, user, trigger, session }) => {
      if (account) {
        token.auth = account;
        token.user_id = user.id;
      }

      let authUser;

      if (user?.id) {
        authUser = await prisma.users.findUnique({
          where: { email: token?.email as string },
        });

        if (!authUser) {
          authUser = await prisma.users.create({
            data: {
              email: token?.email as string,
              user_id: token?.sub as string,
              name: token.name,
              image: token.picture,
            },
          });
        } else {
          authUser = await prisma.users.update({
            where: { email: token?.email as string },
            data: {
              user_id: token?.sub as string,
              name: token.name,
              image: token.picture,
            },
          });

          // const roleOwner = await prisma.roles.findUnique({
          //   where: {
          //     name: ROLES.OWNER,
          //   },
          // })

          const orgUser = await prisma.orgUsers.findFirst({
            where: {
              user_id: authUser.id,
              // role_id: roleOwner?.id,
            },
            include: { org: true, role: true },
          });

          token.org = orgUser?.org;
          token.role = orgUser?.role;
        }

        token.id = authUser?.id;
      }

      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.org = session?.org;
        token.role = session?.role;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.user_id = token.user_id as string;
      }
      session.auth = token.auth ?? {};
      session.org = token.org ?? {};
      session.role = token.role ?? {};
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30days
    updateAge: 24 * 60 * 60,
  },
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
};
