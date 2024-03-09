import type { SendMailOptions } from "nodemailer";
import { createTransport } from "nodemailer";

import { env } from "./env.mjs";

const transporter = createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: env.RESEND_API_KEY,
  },
});

const sendEmail = ({ ...opts }: Omit<SendMailOptions, "from">) => {
  return transporter.sendMail({ from: env.RESEND_FROM_EMAIL, ...opts });
};

export { sendEmail, transporter };
