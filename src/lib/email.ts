import type { SendMailOptions } from "nodemailer";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

const sendEmail = ({ ...opts }: Omit<SendMailOptions, "from">) => {
  return transporter.sendMail({ from: process.env.RESEND_FROM_EMAIL, ...opts });
};

export { sendEmail, transporter };
