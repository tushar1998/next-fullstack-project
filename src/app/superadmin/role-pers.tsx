"use client";

import React from "react";
import { CreatePermission, createPermissions } from "@/actions/permissions";
import { createRolePermission, type CreateRolePermission } from "@/actions/role-permissions";
import { createRole } from "@/actions/roles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

import { TRole } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup, FormInput, ToggleInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useToast } from "@/components/ui/use-toast"

const RoleForm = () => {
  const form = useForm<TRole>({
    defaultValues: { name: "", display_name: "", perform_action_on: [] },
  });

  // const { toast } = useToast()

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: TRole) => createRole(variables),

    onSuccess: () => {
      // toast({ variant: "success", title: "Role created" })
      queryClient.invalidateQueries(["roles"]);
    },

    // onError: () => toast({ variant: "error", title: "Role creation failed" }),

    onSettled: () => form.reset(),
  });

  const onSubmit: SubmitHandler<TRole> = (values: TRole) => {
    mutate(values);
  };
  const onError: SubmitErrorHandler<TRole> = (error) => {
    console.error(error);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <h2 className="text-xl">Roles</h2>
        <FormInput name="name" label="Name" description="Non-spaced role name">
          <Input placeholder="Enter name"></Input>
        </FormInput>
        <FormInput name="display_name" label="Display Name">
          <Input placeholder="Enter Display name" />
        </FormInput>
        <ToggleInput
          name="singleton"
          label="Singleton"
          description="Whether the role be assignable to multiple members of organization."
          message
        >
          <Checkbox />
        </ToggleInput>

        <CheckboxGroup
          name="perform_action_on"
          label="Perform Action on"
          description="Role heirarchy for keeping superiority"
          options={[
            { label: "View", value: "view" },
            { label: "Admin", value: "admin" },
            { label: "Organization Owner", value: "owner" },
          ]}
        />

        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

const PermissionForm = () => {
  const form = useForm<CreatePermission>({
    defaultValues: {
      name: "",
      display_name: "",
      scope: "",
    },
  });

  // const { toast } = useToast()

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: CreatePermission) => createPermissions(variables),

    onSuccess: () => {
      // toast({ variant: "success", title: "Permission created" })
      queryClient.invalidateQueries(["permissions"]);
    },

    onError: () => {},
    // toast({ variant: "error", title: "Permission creation failed" }),

    onSettled: () => form.reset(),
  });
  const onSubmit: SubmitHandler<CreatePermission> = (values) => {
    mutate(values);
  };

  const onError: SubmitErrorHandler<CreatePermission> = () => {};

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
        <h2 className="text-xl">Permissions</h2>
        <FormInput name="name" label="Name">
          <Input placeholder="Enter name"></Input>
        </FormInput>
        <FormInput name="display_name" label="Display Name">
          <Input placeholder="Enter Display name" />
        </FormInput>
        <FormInput name="scope" label="Scope">
          <Input placeholder="Enter Scope" />
        </FormInput>

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

const RolePermission = () => {
  const form = useForm<CreateRolePermission>({
    defaultValues: {
      role_id: "",
      permission_id: "",
    },
  });

  // const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: CreateRolePermission) => createRolePermission(variables),

    onSuccess: () => {
      // toast({ variant: "success", title: "Role Permission created" });
      queryClient.invalidateQueries(["role-permissions"]);
    },

    // onError: () => toast({ variant: "error", title: "Role Permission creation failed" }),

    onSettled: () => form.reset(),
  });

  const onSubmit: SubmitHandler<CreateRolePermission> = (values) => {
    mutate(values);
  };

  const onError: SubmitErrorHandler<CreateRolePermission> = () => {};

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
        <h2 className="text-xl">Role Permissions</h2>
        <FormInput name="role_id" label="Role">
          <Input placeholder="Enter role"></Input>
        </FormInput>
        <FormInput name="permission_id" label="Permission">
          <Input placeholder="Enter permissions" />
        </FormInput>

        <Button type="submit" disabled={isLoading} loading={isLoading}>
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default function RolePermissionForms() {
  return (
    <ScrollArea className="h-[750px] p-4">
      <RolePermission />
      <PermissionForm />
      <RoleForm />
    </ScrollArea>
  );
}
