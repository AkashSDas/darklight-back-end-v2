import { Request, Response } from "express";

import logger from "../logger";
import { SignupUserInputBody } from "../schema/base-auth.schema";
import { createUser } from "../services/user.service";
import { sendResponseToClient } from "../utils/client-response";
import { EmailOptions, sendEmail } from "../utils/send-email";

/**
 * Create a new user and send email verification link to user's email
 *
 * @param req Express request object with `SignupUserInputBody` as body type
 * @param res Express response object
 */
export const signup = async (
  req: Request<{}, {}, SignupUserInputBody>,
  res: Response
) => {
  const { fullName, username, email, password } = req.body;
  const user = await createUser({
    fullName,
    username,
    email,
    passwordDigest: password, // it will be converted to hash in `pre` Mongoose middleware
  });

  // Send email verification link to user's email
  const token = user.generateEmailVerificationToken();
  await user.save({ validateModifiedOnly: false }); // saving token info to DB
  logger.info(user);

  // Doing this after the user is saved to DB because if it is done above the passwordDigest will be undefined
  // and it will give error in `pre` save hook (in the bcrypt.hash function) that
  // Error: Illegal arguments: undefined, number (undefined is the passwordDigest)
  user.passwordDigest = undefined; // remove the password digest from the response

  // URL sent to the user for verifying user's email
  const endpoint = `/api/base-auth/confirm-email/${token}`;
  const confirmEmailURL = `${req.protocol}://${req.get("host")}${endpoint}`;

  const opts: EmailOptions = {
    to: user.email,
    subject: "Confirm your email",
    text: "Confirm your email using the link below",
    html: `<p>Confirm your email with this 🔗 <a href="${confirmEmailURL}">link</a></p>`,
  };

  try {
    // Sending mail
    await sendEmail(opts);
    sendResponseToClient(res, {
      status: 200,
      error: false,
      msg: "Account created successfully. Please verify your email with the link sent to your registered email",
      data: { user },
    });
  } catch (error) {
    // If sending email fails then make `emailVerificationToken` and `emailVerificationTokenExpiry` as undefined
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save({ validateModifiedOnly: false });

    logger.error(error);
    sendResponseToClient(res, {
      status: 200,
      error: false,
      msg: "Account created successfully. Please login and verify your email",
      data: { user },
    });
  }
};
