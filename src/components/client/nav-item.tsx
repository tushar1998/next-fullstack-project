"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";

export interface NavItemProps {
  href: string;
  id: string;
  title: string;
}

export default function NavItem({ href, id, title }: NavItemProps) {
  const path = usePathname();

  const pathName = useMemo(() => {
    const pathArr = path.split("/");
    return pathArr[pathArr.length - 1];
  }, [path]);

  return (
    <Link
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-6 rounded-md p-2.5 data-[state=true]:bg-accent-foreground data-[state=true]:text-accent"
      )}
      href={href}
      key={id}
      data-state={pathName === id}
    >
      <p>{title}</p>
    </Link>
  );
}
