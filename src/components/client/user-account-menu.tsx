"use client";

import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { getShortName } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropDown, DropDownProps } from "@/components/ui/dropdown-menu";

import Conditional from "../server/conditional";
import { LifeBuoy, Loader2, LogOut, UserCircle2 } from "lucide-react";
import { useServerSession } from "./context/session-ctx";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";

export default function UserAccountMenu() {
  // const { toast } = useToast();

  const [opened, { toggle }] = useDisclosure();

  const { role, user } = useServerSession();

  const { mutate, isLoading } = useMutation({
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
        <ThemeToggle className="inline-flex h-8 w-8 sm:hidden" />
      </div>
    ),
    items: [
      [
        {
          id: "account",
          menuTitle: (
            <>
              <UserCircle2 className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </>
          ),
        },
      ],
      [
        {
          id: "help",
          menuTitle: (
            <>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Help Center</span>
            </>
          ),
        },
        {
          id: "logout",
          menuTitle: (
            <>
              <Conditional satisfies={isLoading}>
                <Loader2 className="mr-2 mt-0.5 h-4 w-4 animate-spin" />
                <LogOut className="mr-2 mt-0.5 h-4 w-4" />
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
        className="h-8 w-8 rounded-full focus-visible:ring-1 focus-visible:ring-offset-0 sm:h-10 sm:w-10"
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
