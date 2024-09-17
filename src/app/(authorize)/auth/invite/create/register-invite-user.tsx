"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import type { SubmitHandler, Validate } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { setPassword, setPasswordSocial } from "@/actions/invite";
import GoogleLogo from "@/assets/svgs/google-logo";
import { Input } from "@/components/client/common/input";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import type { TUser } from "@/lib/prisma";

interface InviteSignUpSchema {
  password: string;
  confirm_password: string;
}

interface RegisterInviteUserProps {
  user: TUser;
}

interface MutationVars extends InviteSignUpSchema {
  id: string;
}

const RegisterInviteUser = ({ user }: RegisterInviteUserProps) => {
  const router = useRouter();

  const methods = useForm<InviteSignUpSchema>({
    defaultValues: { password: "", confirm_password: "" },
    mode: "onBlur",
  });

  const { mutate: mutateSetPassword, isPending } = useMutation({
    mutationFn: ({ password, id }: MutationVars) => setPassword(id, password),
    onSuccess: () => toast.success("Registeration Success!"),
    onError: () => toast.error("Registeration Failed!"),
    onSettled: () => router.push("/"),
  });

  const { mutate: mutateSetGoogle, isPending: isLoadingGoogle } = useMutation({
    mutationFn: (id: string) => setPasswordSocial(id),
    onSuccess: () => toast.success("Registeration Success!"),
    onError: () => toast.error("Registeration Failed!"),
    onSettled: () => router.push("/"),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<InviteSignUpSchema> = ({ password, confirm_password }) => {
    mutateSetPassword({ password, id: user.id, confirm_password });
  };

  const validateConfirmPassword: Validate<string, InviteSignUpSchema> = (val: string, formVal) => {
    if (val !== formVal.password) {
      return "Password does not match";
    }

    return false;
  };

  // On server validations
  // Validate user is signed up or not

  const handleWithGoogle = () => mutateSetGoogle(user.id);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          name="password"
          label="Password"
          description="Must be atleast 8 characters"
          rules={{
            required: { value: true, message: "Password is required" },
            minLength: { value: 8, message: "Must be atleast 8 characters" },
          }}
        >
          <Input placeholder="Enter your password" withShowPassword type="password" />
        </FormInput>
        <FormInput
          name="confirm_password"
          label="Confirm password"
          rules={{ validate: validateConfirmPassword }}
        >
          <Input withShowPassword placeholder="Confirm password" type="password" />
        </FormInput>

        <Button type="submit" className="w-full" loading={isPending}>
          Set Password
        </Button>

        <Separator />

        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={handleWithGoogle}
          loading={isLoadingGoogle}
        >
          <GoogleLogo />
          Continue with Google
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterInviteUser;
