"use client";

import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { LifeBuoy, Loader2, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { DropDownProps } from "@/components/ui/dropdown-menu";
import { DropDown } from "@/components/ui/dropdown-menu";
import { getShortName } from "@/lib/utils";

import Conditional from "../server/conditional";
import { useServerSession } from "./context/session-ctx";
import { ThemeToggle } from "./theme-toggle";

export default function UserAccountMenu() {
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure();

  const { role, user } = useServerSession();

  const { mutate, isPending } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      toast.success("Logged out successfully");
      toggle();
    },
    onSettled: () => close(),
  });

  const menu: DropDownProps["menu"] = {
    id: "my-account",
    label: (
      <div className="flex items-center justify-between">
        <span>
          {user?.name}
          <p className="block truncate text-xs font-normal leading-none text-muted-foreground">
            {role.display_name}
          </p>
        </span>
        <ThemeToggle className="inline-flex size-8 sm:hidden" />
      </div>
    ),
    items: [
      [
        {
          id: "account",
          menuTitle: (
            <>
              <Settings className="mr-2 size-4" />
              <span>Settings</span>
            </>
          ),
          onClick: () => router.push("/settings"),
        },
      ],
      [
        {
          id: "help",
          menuTitle: (
            <>
              <LifeBuoy className="mr-2 size-4" />
              <span>Help Center</span>
            </>
          ),
        },
        {
          id: "logout",
          menuTitle: (
            <>
              <Conditional satisfies={isPending}>
                <Loader2 className="mr-2 mt-0.5 size-4 animate-spin" />
                <LogOut className="mr-2 mt-0.5 size-4" />
              </Conditional>
              <div className="leading-none">
                <p>Logout</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </>
          ),
          className: "items-start",
          onSelect: (event: Event) => {
            event.preventDefault();
            mutate();
          },
        },
      ],
    ],
  };

  return (
    <DropDown menu={menu} defaultOpen={false} open={opened} onOpenChange={toggle}>
      <Button
        className="size-8 rounded-full focus-visible:ring-1 focus-visible:ring-offset-0 sm:size-10"
        variant="outline"
      >
        <Avatar className="mx-auto cursor-pointer">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback>{getShortName(user?.name)}</AvatarFallback>
        </Avatar>
      </Button>
    </DropDown>
  );
}
