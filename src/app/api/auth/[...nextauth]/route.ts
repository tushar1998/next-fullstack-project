import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { prisma } from "@/lib/prisma"

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT as string,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET as string,
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
        token.auth = account
        token.user_id = user.id
      }

      let authUser

      if (user?.id) {
        authUser = await prisma.users.findUnique({
          where: { email: token?.email as string },
        })

        if (!authUser) {
          authUser = await prisma.users.create({
            data: {
              email: token?.email as string,
              user_id: token?.sub as string,
              name: token.name,
              image: token.picture,
            },
          })
        } else {
          authUser = await prisma.users.update({
            where: { email: token?.email as string },
            data: {
              user_id: token?.sub as string,
              name: token.name,
              image: token.picture,
            },
          })

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
          })

          token.org = orgUser?.org
          token.role = orgUser?.role
        }

        token.id = authUser?.id
      }

      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.org = session?.org
        token.role = session?.role
      }

      return token
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.user_id = token.user_id as string
      }
      session.auth = token.auth ?? {}
      session.org = token.org ?? {}
      session.role = token.role ?? {}
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
