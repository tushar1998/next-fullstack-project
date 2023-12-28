"use client";

import { Button } from "@/components/ui/button";
import { TRegister } from "@/lib/prisma";
import { CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface VerifyButtonProps {
  registration: TRegister;
}

function VerifyButton({ registration }: VerifyButtonProps) {
  const router = useRouter();

  const login = async () => {
    const response = await signIn("credentials", {
      email: registration?.email,
      password: registration?.password,
      hashed: true,
      redirect: false,
    });

    router.push("/auth/create");
  };

  return (
    <main className="flex flex-col gap-4">
      <span className="flex gap-2">
        <CheckCircle2 className="stroke-lime-600 dark:stroke-lime-500" />
        <p>Vetification Successful</p>
      </span>
      <Button className="w-full" onClick={login}>
        Continue
      </Button>
    </main>
  );
}

export default VerifyButton;
