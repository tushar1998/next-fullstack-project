import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import React from "react";

import GoogleLogo from "@/assets/svgs/google-logo";
import AuthButton from "@/components/client/auth-button";
import SignInWithCredentials from "@/components/client/sign-in-form";
import { Separator } from "@/components/ui/separator";
import { Logger } from "@/lib/logger";
import { nextAuthOptions } from "@/lib/next-auth";
import type { PageProps } from "@/types/page";

export default async function SignIn({ searchParams }: Readonly<PageProps>) {
  const logger = new Logger(SignIn.name);
  const providers = await getProviders();

  const session = await getServerSession(nextAuthOptions);

  if (session) {
    logger.log("server session.user.id found redirecting to dashboard");

    redirect("/");
  }

  return (
    <main className="flex flex-col gap-4">
      <span>
        <h1 className="text-2xl">Welcome back,</h1>
        <p className="text-xs text-muted-foreground">Please sign in to continue.</p>
        {searchParams?.error ? (
          <p className="text-destructive">Email id or password incorrect</p>
        ) : null}
      </span>
      <SignInWithCredentials />
      <Separator />
      <AuthButton
        provider={providers?.google}
        authButtonType="signin"
        className="w-full gap-4"
        variant="outline"
      >
        <GoogleLogo />
        Sign In with {providers?.google.name}
      </AuthButton>

      <p className="text-center text-xs">
        Don&#39;t have an account?
        <Link
          href="/auth/signup"
          className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        >
          Create an account
        </Link>
      </p>
    </main>
  );
}
