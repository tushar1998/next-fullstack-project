import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { genSaltSync, hashSync } from "bcryptjs";

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
