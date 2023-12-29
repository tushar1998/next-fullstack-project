import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";

import { PageProps } from "@/types/page";
import AuthButton from "@/components/client/auth-button";
import { nextAuthOptions } from "@/lib/next-auth";
import GoogleLogo from "@/assets/svgs/google-logo";
import SignUpForm from "@/components/client/sign-up-form";
import { Separator } from "@/components/ui/separator";

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
    <main className="flex flex-col gap-4">
      <span>
        <h1 className="text-2xl">{grettings()}</h1>
        <p className="text-xs text-muted-foreground">Let&#39;s create your account</p>
      </span>
      <SignUpForm />
      <Separator />
      <AuthButton
        provider={providers?.google}
        authButtonType={signUpNewUser ? "signup" : "signupUser"}
        className="w-full"
        variant="outline"
      >
        <GoogleLogo />
        Sign Up with {providers?.google.name}
      </AuthButton>

      {searchParams?.new === "true" && (
        <p className="text-xs text-red-500 dark:text-red-600">
          User Not found, did you forgot to signup
        </p>
      )}

      {searchParams?.error && (
        <p className="text-xs text-red-500 dark:text-red-600">{searchParams?.error}</p>
      )}

      <p className="text-center text-xs">
        Already have an account?
        <Link
          href="/auth/signin?checkAuth=false"
          className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
