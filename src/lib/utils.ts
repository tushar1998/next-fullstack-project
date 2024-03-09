import { genSaltSync, hashSync } from "bcryptjs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "./env.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getShortName = (name?: string | null): string => {
  return name ? name.charAt(0) : "";
};

export const encodeString = (text: string) => {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(text, salt);

  return { hashedPassword, salt };
};

export const makeEmailUrl = (href?: string) => {
  const appUrl = env.NEXT_APP_URL;

  if (!appUrl) {
    return href;
  }

  if (!href) {
    return "";
  }

  return appUrl.concat(href);
};
