"use server";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { encodeString } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async ({ email, password }: Record<"email" | "password", string>) => {
  const logger = new Logger("Register New User");

  try {
    //? Check if the email already exists - Frontend check
    const { salt, hashedPassword } = encodeString(password);

    const response = await prisma.register.create({
      data: {
        email: email,
        name: email.split("@")[0],
        user_id: uuidv4(),
        password: hashedPassword,
        password_hash_key: salt,
      },
    });

    //? Send Email to the user with verify link /auth/verify?registration=response?.id

    return response;
  } catch (error) {
    logger.error("Failed to register user", JSON.stringify(error, null, 2));

    throw error;
  }
};
