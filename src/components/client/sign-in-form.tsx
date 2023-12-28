"use client";

import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "@/components/ui/form";
import { Button } from "../ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "./common/input";

interface SignInFormSchema {
  email: string;
  password: string;
}

function SignInWithCredentials() {
  const methods = useForm<SignInFormSchema>({
    defaultValues: { email: "", password: "" },
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<SignInFormSchema> = async ({ email, password }) => {
    await signIn("credentials", { email, password });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="email"
          label="Email"
          rules={{ required: { value: true, message: "Please enter your email" } }}
        >
          <Input placeholder="Enter your email" />
        </FormInput>
        <FormInput
          name="password"
          label="Password"
          rules={{ required: { value: true, message: "Please enter your password" } }}
        >
          <Input placeholder="Enter your password" type="password" withShowPassword />
        </FormInput>
        <div className="w-full text-right">
          <Link href="/auth/forgot-password" className="text-sm hover:underline text-current">
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </FormProvider>
  );
}

export default SignInWithCredentials;
