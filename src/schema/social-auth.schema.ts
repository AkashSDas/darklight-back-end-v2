import { object, string, TypeOf } from "zod";

export const addPostOAuthUserInfoSchema = object({
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
  }),
});

export type AddPostOAuthUserInfoSchemaInputBody = TypeOf<
  typeof addPostOAuthUserInfoSchema
>["body"];
