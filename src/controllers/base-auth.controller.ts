import crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import logger from "../logger";
import {
  ConfirmEmailInputParams,
  EmailInputParams,
  ForgotPasswordInputBody,
  GetEmailVerificationLinkInputBody,
  LoginInputBody,
  PasswordResetInput,
  SignupUserInputBody,
  UsernameInputParams,
} from "../schema/base-auth.schema";
import {
  createUser,
  getUser,
  getUserWithFields,
  userExists,
} from "../services/user.service";
import { sendResponseToClient } from "../utils/client-response";
import { BaseApiError } from "../utils/handle-error";
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
  await user.save({ validateModifiedOnly: true }); // saving token info to DB
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
    await user.save({ validateModifiedOnly: true });

    logger.error(error);
    sendResponseToClient(res, {
      status: 200,
      error: false,
      msg: "Account created successfully. Please login and verify your email",
      data: { user },
    });
  }
};

/**
 * Send user an email verification link
 *
 * @param req Express request object with `GetEmailVerificationLinkInputBody` as body type
 * @param res Express response object
 *
 * @throws `BaseApiError` if user is not found
 */
export const getEmailVerificationLink = async (
  req: Request<{}, {}, GetEmailVerificationLinkInputBody>,
  res: Response
) => {
  const { email } = req.body;
  const user = await getUser({ email });
  if (!user) throw new BaseApiError(404, "User does not exists");

  // Check if user is already verified
  if (user.emailVerified) throw new BaseApiError(400, "Email already verified");

  const token = user.generateEmailVerificationToken();
  await user.save({ validateModifiedOnly: true }); // saving token info to DB

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
      msg: "Email verification link sent to your registered email",
    });
  } catch (error) {
    logger.error(error);
    sendResponseToClient(res, {
      status: 500,
      error: true,
      msg: "Something went wrong. Please try again later",
    });
  }
};

export const confirmEmail = async (
  req: Request<ConfirmEmailInputParams>,
  res: Response
) => {
  logger.info(req.params.token);
  /** Encrypted the token given by the user */
  const encryptedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await getUser({
    emailVerificationToken: encryptedToken,
    emailVerificationTokenExpiry: { $gt: new Date(Date.now()) },
  });
  if (!user) throw new BaseApiError(400, "Invalid or expired token");

  // Verifying user's email and making the account active
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  user.isActive = true;
  await user.save({ validateModifiedOnly: true });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Email is verified and your account is activated",
  });
};

export const login = async (
  req: Request<{}, {}, LoginInputBody>,
  res: Response
) => {
  const { email, password } = req.body;

  // Check if user exists OR not. Also get `passwordDigest` too as it will be
  // used while using `.checkPassword` method
  const user = await getUserWithFields({ email }, "+passwordDigest");
  if (!user) throw new BaseApiError(404, "User does not exists");

  // Check if the password is correct
  if (!(await user.checkPassword(password))) {
    throw new BaseApiError(401, "Unauthorized, incorrect password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only be web server
    // secure: process.env.NODE_ENV === "production", // only works in https, only accessible via https
    // secure: true,
    maxAge: 1 * 60 * 1000, // 1 minutes, should match the expiresIn of the refresh token
    sameSite: "none",
  });

  user.passwordDigest = undefined; // remove the password digest from the response

  // Sending the access token which contains userId and email to the client
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Login successful",
    data: { user, accessToken },
  });
};

export const checkAuth = async (req: Request, res: Response) => {
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "You are authenticated",
  });
};

export const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new BaseApiError(401, "Session expired, Please login again");
  }

  const refreshToken = cookies.jwt;
  // Verify refresh token
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) throw new BaseApiError(403, "Forbidden");

        const user = await getUser({ userId: decoded.userId });
        if (!user) throw new BaseApiError(404, "User does not exists");

        const accessToken = user.generateAccessToken();
        sendResponseToClient(res, {
          status: 200,
          error: false,
          msg: "Access token refreshed",
          data: { user, accessToken },
        });
      }
    );
  } catch (err) {
    logger.error(err);
    throw new BaseApiError(500, "Something went wrong please try again");
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordInputBody>,
  res: Response
) => {
  // Check if the user exists OR not
  const user = await getUser({ email: req.body.email });
  if (!user) throw new BaseApiError(404, "User does not exists");

  // Generating forgot password token
  const token = user.generatePasswordResetToken();
  await user.save({ validateModifiedOnly: true }); // saving token info to DB

  // URL sent to user to reset user's password
  // const endpoint = `/api/auth/confirm-password-reset/${token}`;
  // const passwordResetURL = `${req.protocol}://${req.get("host")}${endpoint}`;
  const frontEndURL = `${process.env.FRONTEND_BASE_URL}/auth/password-reset/${token}`;

  const opts: EmailOptions = {
    to: user.email,
    subject: "Reset your password",
    text: "Reset your password",
    html: `<p>Reset your password with this 🔗 <a href="${frontEndURL}">link</a></p>`,
  };

  try {
    // Sending email
    await sendEmail(opts);
    return sendResponseToClient(res, {
      status: 200,
      error: false,
      msg: "Password reset instructions sent to your email",
    });
  } catch (err) {
    // If password reset failed then make `passwordResetToken` and `passwordResetTokenExpiry`
    // as undefined
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save({ validateModifiedOnly: true });
    logger.error(err);
    throw new BaseApiError(500, "Something went wrong, Please try again");
  }
};

export const resetPassword = async (
  req: Request<PasswordResetInput["params"], {}, PasswordResetInput["body"]>,
  res: Response
) => {
  logger.info(req.params.token);
  /** Encrypted the token given by the user */
  const encryptedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await getUser({
    passwordResetToken: encryptedToken,
    passwordResetTokenExpiry: { $gt: new Date(Date.now()) },
  });
  if (!user) throw new BaseApiError(400, "Invalid or expired token");

  user.passwordDigest = req.body.password; // this will be converted to hash in `pre` Mongoose middleware
  user.passwordResetToken = null;
  user.passwordResetTokenExpiry = null;

  // Here no validateModifiedOnly needs to be given since we're updating few fields
  // and user has already registered meaning all necessary feilds are filled
  await user.save();
  user.passwordDigest = undefined; // remove the password digest from the response

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Password reset is successful",
    data: { user },
  });
};

/**
 *
 * @param req Express Request
 * @param res Express Response
 *
 * @remarks
 * The logout route is used to clear the refresh token from the request cookies,
 * so you can't refresh you access token without logging in again but you can
 * still be authenticated with the access token until it expires
 */
export const logout = async (req: Request, res: Response) => {
  if (!req.cookies?.jwt) throw new BaseApiError(204, "No content");
  res.clearCookie("jwt", {
    httpOnly: true, // accessible only be web server
    // secure: process.env.NODE_ENV === "production", // only works in https, only accessible via https
    secure: true,
    sameSite: "none", // to allow cookies to be sent cross-origin
  });

  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Logout successful",
  });
};

export const usernameAvailable = async (
  req: Request<UsernameInputParams>,
  res: Response
) => {
  const exists = await userExists({ username: req.params.username });
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Username availability",
    data: { available: exists === 0 },
  });
};

export const emailAvailable = async (
  req: Request<EmailInputParams>,
  res: Response
) => {
  const exists = await userExists({ email: req.params.email });
  sendResponseToClient(res, {
    status: 200,
    error: false,
    msg: "Username availability",
    data: { available: exists === 0 },
  });
};
