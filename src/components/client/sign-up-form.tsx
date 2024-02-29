"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import type { SubmitErrorHandler, SubmitHandler, Validate } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerUser } from "@/actions/auth";
import { findUserByEmail } from "@/actions/org-user";
import { Input } from "@/components/client/common/input";

import { Button } from "../ui/button";
import { FormInput } from "../ui/form";

interface SignUpFormSchema {
  email: string;
  password: string;
  confirm_password: string;
}

function SignUpForm() {
  const methods = useForm<SignUpFormSchema>({
    defaultValues: { email: "", password: "", confirm_password: "" },
    mode: "onBlur",
  });

  const router = useRouter();

  const { handleSubmit } = methods;

  const { mutate } = useMutation({
    mutationFn: async (variables: Record<"email" | "password", string>) => registerUser(variables),
    onSuccess: (data) => {
      const searchParams = new URLSearchParams();

      if ("email" in data) {
        searchParams.set("email", data?.email);
        router.push(`/auth/register?${searchParams?.toString()}`);
      } else {
        toast.error("Failed to send registration email!");
      }
    },
    onError: () => toast.error("Failed to Register!"),
  });

  const onSubmit: SubmitHandler<SignUpFormSchema> = (values) => {
    mutate(values);
  };

  const onError: SubmitErrorHandler<SignUpFormSchema> = () => {};

  const validateConfirmPassword: Validate<string, SignUpFormSchema> = (
    val: string,
    formVal: SignUpFormSchema
  ) => {
    if (val !== formVal.password) {
      return "Password does not match";
    }

    return false;
  };

  const validateEmail: Validate<string, SignUpFormSchema> = async (val) => {
    const user = await findUserByEmail(val);

    if (user) {
      return "User already exists!";
    }

    return false;
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        <FormInput
          label="Email"
          name="email"
          rules={{
            required: { value: true, message: "Email is required" },
            pattern: {
              value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
              message: "Invalid email address",
            },
            validate: validateEmail,
          }}
          withAsterisk
        >
          <Input placeholder="Enter your email" />
        </FormInput>

        <FormInput
          label="Password"
          name="password"
          withAsterisk
          description="Must be atleast 8 characters"
          rules={{
            required: { value: true, message: "Password is required" },
            minLength: { value: 8, message: "Must be atleast 8 characters" },
          }}
        >
          <Input placeholder="Enter your password" type="password" withShowPassword />
        </FormInput>

        <FormInput
          label="Confirm Password"
          name="confirm_password"
          rules={{ validate: validateConfirmPassword }}
        >
          <Input placeholder="Re-enter password" type="password" withShowPassword />
        </FormInput>

        <Button type="submit" className="w-full">
          Get Started
        </Button>
      </form>
    </FormProvider>
  );
}

export default SignUpForm;
