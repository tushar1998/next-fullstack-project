"use client";

import { useRouter } from "next/navigation";
import type { ClientSafeProvider } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import React, { useState } from "react";

import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

interface AuthButtonProps extends ButtonProps {
  provider?: ClientSafeProvider;
  authButtonType: "signin" | "signup" | "signout" | "signupUser";
}

export default function AuthButton({
  children,
  provider,
  authButtonType: type,
  ...props
}: AuthButtonProps) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    try {
      setLoading(true);

      if (type === "signout") {
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/auth/signin`,
        });
      }

      if (type === "signin") {
        signIn(provider?.id, { callbackUrl: window.location.origin });
      }

      if (type === "signup") {
        router.push("/auth/create");
      }

      if (type === "signupUser") {
        signIn(provider?.id, { callbackUrl: "/auth/create" });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAuth} loading={isLoading} {...props}>
      {children}
    </Button>
  );
}
