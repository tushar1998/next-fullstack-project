import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { getProviders } from "next-auth/react"

import { Logger } from "@/lib/logger"
import AuthButton from "@/components/client/auth-button"
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function SignIn() {
  const logger = new Logger(SignIn.name)
  const providers = await getProviders()

  const session = await getServerSession(nextAuthOptions)

  if (session) {
    logger.log("server session.user.id found redirecting to dashboard")

    redirect("/dashboard")
  }

  return (
    <>
      <h1 className="text-2xl">Welcome back,</h1>
      <p className="mb-4 text-xs">Please sign in to continue.</p>
      {providers &&
        Object.keys(providers).map((provider) => {
          return (
            <AuthButton
              key={provider}
              provider={providers[provider]}
              authButtonType="signin"
              className="w-full"
            >
              Sign In with {providers[provider].name}
            </AuthButton>
          )
        })}

      <p className="mt-4 text-center text-xs">
        Don&#39;t have an account?
        <Link
          href="/auth/signup"
          className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        >
          Create an account
        </Link>
      </p>
    </>
  )
}
