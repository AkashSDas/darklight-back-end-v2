import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/** Options for email sent to the user */
export interface EmailOptions {
  /** Email address of the receiver */
  to: string;
  /** Subject of the email */
  subject: string;
  /** Plain text version of the message */
  text: string;
  /** HTML version of the message */
  html: string;
}

/**
 * Send email
 * @param opts Options for email sent to the user
 * @returns {Promise<SMTPTransport.SentMessageInfo>} Returns a promise of sending the email
 */
export const sendEmail = async (
  opts: EmailOptions
): Promise<SMTPTransport.SentMessageInfo> => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 0,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const msg = {
    from: process.env.FROM_EMAIL,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  };

  return await transporter.sendMail(msg);
};
