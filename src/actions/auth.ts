"use server";

import { render } from "@react-email/render";
import { v4 as uuidv4 } from "uuid";

import Register from "@/emails/register";
import { sendEmail } from "@/lib/email";
import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { encodeString } from "@/lib/utils";

export const registerUser = async ({ email, password }: Record<"email" | "password", string>) => {
  const logger = new Logger("Register New User");

  try {
    // ? Check if the email already exists - Frontend check
    const { salt, hashedPassword } = encodeString(password);

    const name = email.split("@")[0];

    const response = await prisma.register.create({
      data: {
        email,
        name,
        user_id: uuidv4(),
        password: hashedPassword,
        password_hash_key: salt,
      },
    });

    // ? Send Email to the user with verify link /auth/verify?registration=response?.id
    await sendEmail({
      to: email,
      subject: "Register to Untitled UI",
      html: await render(
        Register({
          email,
          href: `/auth/verify?registration=${response?.id}`,
          name,
        })
      ),
    });

    // ? Add activity log

    return response;
  } catch (error) {
    logger.error("Failed to register user", JSON.stringify(error, null, 2));

    throw error;
  }
};
