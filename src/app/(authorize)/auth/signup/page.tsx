import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

import { PageProps } from "@/types/page";
import AuthButton from "@/components/client/auth-button";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SignUp({ searchParams }: PageProps) {
  const providers = await getProviders();
  const session = await getServerSession(nextAuthOptions);

  const isAuthenticated: boolean = Boolean(session?.user);

  const grettings = () => {
    if (isAuthenticated) {
      return `Welcome ${session?.user?.name},`;
    }

    return `Welcome,`;
  };

  const signUpNewUser: boolean = isAuthenticated && searchParams?.new === "true";

  return (
    <>
      <h1 className="text-2xl">{grettings()}</h1>
      <p className="mb-4 text-xs">Let&#39;s create your account</p>

      <div className="mb-2">
        {providers &&
          Object.keys(providers).map((provider) => {
            return (
              <AuthButton
                key={provider}
                provider={providers[provider]}
                authButtonType={signUpNewUser ? "signup" : "signupUser"}
                className="w-full"
              >
                Sign Up with {providers[provider].name}
              </AuthButton>
            );
          })}
      </div>

      {searchParams?.new === "true" && (
        <p className="text-xs text-red-500 dark:text-red-600">
          User Not found, did you forgot to signup
        </p>
      )}

      {searchParams?.error && (
        <p className="text-xs text-red-500 dark:text-red-600">{searchParams?.error}</p>
      )}

      <p className="mt-4 text-center text-xs">
        Already have an account?
        <Link
          href="/auth/signin?checkAuth=false"
          className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
