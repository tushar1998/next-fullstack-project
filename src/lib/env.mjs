import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),
    GOOGLE_OAUTH_CLIENT: z.string().min(1),
    GOOGLE_OAUTH_SECRET: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    API_BASE_URL: z.string().url().min(1),
    INVITE_EXPIRY_DAYS: z.string().min(1),
    HTTP_BASIC_AUTH: z
      .string()
      .min(1)
      .refine((value) => value.includes(":")),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_PREMIUM_MONTHLY_PRICE_ID: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "NEXT_PUBLIC_",

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().min(1),
    NEXT_PUBLIC_STRIPE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    ...process.env,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_API_KEY: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
    NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
