import { object, string, TypeOf } from "zod";

/** User signup request's input schema */
export const signupUserSchema = object({
  body: object({
    fullName: string({ required_error: "Fullname is required" })
      .max(240, "Fullname must be less than 240 characters")
      .min(6, "Fullname should be more than 6 characters"),
    username: string({ required_error: "Username is required" })
      .max(120, "Username must be less than 120 characters")
      .min(3, "Username should be more than 3 characters"),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be more than 6 characters"
    ),
    confirmPassword: string({ required_error: "Confirm password is required" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match",
    path: ["confirmPassword"],
  }),
});

/** To get email verification link request's input schema */
export const getEmailVerificationLinkSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
  }),
});

/** Confirm email request's input schema */
export const confirmEmailSchema = object({
  params: object({ token: string() }),
});

/** User login request's input schema */
export const loginSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be more than 6 characters"
    ),
    confirmPassword: string({ required_error: "Confirm password is required" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match",
    path: ["confirmPassword"],
  }),
});

/** Forgot password request's input schema */
export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
  }),
});

export type SignupUserInputBody = TypeOf<typeof signupUserSchema>["body"];
export type GetEmailVerificationLinkInputBody = TypeOf<
  typeof getEmailVerificationLinkSchema
>["body"];
export type ConfirmEmailInputParams = TypeOf<
  typeof confirmEmailSchema
>["params"];
export type LoginInputBody = TypeOf<typeof loginSchema>["body"];
export type ForgotPasswordInputBody = TypeOf<
  typeof forgotPasswordSchema
>["body"];
