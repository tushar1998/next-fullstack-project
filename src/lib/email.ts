import { createTransport } from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = createTransport({
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: "my_user",
    pass: "my_password",
  },
});

export { transporter, resend };
