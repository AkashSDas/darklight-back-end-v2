/**
 * Schema naming convention - <controller>Schema (without the Ctrl suffix)
 */

import { object, string, TypeOf } from "zod";
import {
  zodUserConfirmPassword,
  zodUserEmail,
  zodUserFullName,
  zodUserPassword,
  zodUserUsername,
} from "./base.schema";

// =================================
// SCHEMAS
// =================================

export const signupUserSchema = object({
  body: object({
    fullName: zodUserFullName,
    username: zodUserUsername,
    email: zodUserEmail,
    password: zodUserPassword,
    confirmPassword: zodUserConfirmPassword,
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match",
    path: ["confirmPassword"],
  }),
});

export const getEmailVerificationLinkSchema = object({
  body: object({ email: zodUserEmail }),
});

export const confirmEmailSchema = object({
  params: object({ token: string() }),
});

export const loginSchema = object({
  body: object({
    email: zodUserEmail,
    password: zodUserPassword,
    confirmPassword: zodUserConfirmPassword,
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match",
    path: ["confirmPassword"],
  }),
});

export const forgotPasswordSchema = object({
  body: object({ email: zodUserEmail }),
});

export const passwordResetSchema = object({
  params: object({ token: string() }),
  body: object({
    password: zodUserPassword,
    confirmPassword: zodUserConfirmPassword,
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match",
    path: ["confirmPassword"],
  }),
});

export const usernameAvailableSchema = object({
  params: object({ username: zodUserUsername }),
});

export const emailAvailableSchema = object({
  params: object({ email: zodUserEmail }),
});

// =================================
// TYPES
// =================================

export type SignupUserInput = TypeOf<typeof signupUserSchema>;
export type GetEmailVerificationLinkInput = TypeOf<
  typeof getEmailVerificationLinkSchema
>;
export type ConfirmEmailInput = TypeOf<typeof confirmEmailSchema>;
export type LoginInput = TypeOf<typeof loginSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type PasswordResetInput = TypeOf<typeof passwordResetSchema>;
export type UsernameInput = TypeOf<typeof usernameAvailableSchema>;
export type EmailInput = TypeOf<typeof emailAvailableSchema>;
