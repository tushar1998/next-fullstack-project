"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { CreateOrgParams } from "@/actions/create-org";
import { createOrg } from "@/actions/create-org";
import { findOrganization } from "@/actions/find-org";
import { Button } from "@/components/ui/button";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface OrgCreateFormSchema {
  name: string;
  display_name: string;
}

interface CreateOrgFormProps {
  userCreate: Session["user"];
}

export default function CreateOrgForm({ userCreate }: CreateOrgFormProps) {
  const { update } = useSession();

  const methods = useForm<OrgCreateFormSchema>({
    mode: "onTouched",
    defaultValues: { name: "", display_name: "" },
  });

  const { push } = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: CreateOrgParams) => createOrg(variables),
    onSuccess: async (data) => {
      await update({ org: data?.org, role: data?.role });
      push("/dashboard");
    },
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<OrgCreateFormSchema> = async ({ name, display_name }) => {
    mutate({ name, display_name, user: userCreate });
  };

  const onError = () => {};

  const orgInputRules = {
    required: {
      value: true,
      message: "Organization name is required",
    },
    minLength: {
      value: 5,
      message: "Minimum 5 characters are allowed",
    },
    maxLength: {
      value: 30,
      message: "Maximum 30 characters are allowed",
    },
  };

  const validateOrg = async (value: string) => {
    const org = await findOrganization(value);

    if (!org) {
      return true;
    }
    return "Organization already exists";
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <FormInput
          name="name"
          description="This is your unique organization name."
          label="Name"
          rules={{
            validate: { value: validateOrg },
            pattern: {
              value: /^[a-z0-9]+(?:[-.][a-z0-9]+)*.[a-z]{2,6}$/g,
              message: "Domain friendly names allowed",
            },
          }}
          message
          className="mb-4"
        >
          <Input type="text" placeholder="Enter Name" />
        </FormInput>
        <FormInput
          name="display_name"
          description="This is your public organization name."
          rules={orgInputRules}
          label="Display Name"
          message
        >
          <Input type="text" placeholder="Enter Display name" />
        </FormInput>
        <Button type="submit" className="mt-4 w-full" loading={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
