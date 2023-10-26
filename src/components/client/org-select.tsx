"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { SelectOptions } from "@/types/nav";
import { TOrganization, TRole } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";

interface OrgSelectOptions extends SelectOptions {
  org: TOrganization;
  role: TRole;
}

interface OrganizationSelectProps {
  orgUsers: OrgSelectOptions[];
  className?: string;
}

export default function OrganizationSelect({ orgUsers, className }: OrganizationSelectProps) {
  const params = useParams();
  const { update, data } = useSession();

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const paramOrg = useMemo(() => {
    return orgUsers.find((orgUser) => orgUser.value === params?.orgId);
  }, [params?.orgId, orgUsers]);

  const orgDisplayName = useMemo(() => {
    return paramOrg?.org?.display_name ?? "Select organization...";
  }, [paramOrg?.org?.display_name]);

  if (!params?.orgId || !paramOrg) {
    return <></>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[175px] flex-1 justify-between border-none px-2 max-[310px]:w-[125px]",
            className
          )}
        >
          <div className="truncate leading-none">
            <span title={orgDisplayName} className="text-left">
              {orgDisplayName} jnjksdncjkskjcsd
            </span>
            <p className="truncate text-left text-xs text-muted-foreground" title={orgDisplayName}>
              {orgDisplayName ? paramOrg?.value : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Conditional satisfies={!data?.org}>
              <Icons.spinner className="animate-spin" />
            </Conditional> */}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandEmpty>No Organization found.</CommandEmpty>
          <CommandGroup>
            {orgUsers.map(({ value, label, org, role }) => (
              <CommandItem
                key={value}
                value={value}
                onSelect={async (currentValue) => {
                  setOpen(false);

                  await update({ org, role });

                  if (currentValue !== data?.org?.name) {
                    router.push(`/dashboard/${currentValue}`);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    paramOrg?.org?.name === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
