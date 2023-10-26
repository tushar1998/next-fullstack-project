"use client";

import React from "react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Search } from "lucide-react";

interface CommandKProps {
  className?: string;
}

export default function CommandK({ className }: CommandKProps) {
  const [opened, { toggle }] = useDisclosure();
  useHotkeys([["mod+K", () => toggle()]]);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={toggle} className="mr-1 sm:hidden">
        <Search className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        className={cn(
          "hidden h-9 justify-between text-muted-foreground hover:text-muted-foreground sm:inline-flex",
          className
        )}
        onClick={toggle}
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 stroke-muted-foreground" />
          <p>Search</p>
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-sm">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={opened} onOpenChange={toggle}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calculator</CommandItem>
            <CommandItem>Correct</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
