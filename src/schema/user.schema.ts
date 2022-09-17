import { object, string, TypeOf } from "zod";

/** Username available request's input schema */
export const checkUsernameAvaiableSchema = object({
  params: object({
    username: string({ required_error: "Username is required" })
      .max(120, "Username must be less than 120 characters")
      .min(3, "Username should be more than 3 characters"),
  }),
});
/** Email available request's input schema */
export const checkEmailAvaiableSchema = object({
  params: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email"
    ),
  }),
});

export type CheckUsernameAvaiableInputParams = TypeOf<
  typeof checkUsernameAvaiableSchema
>["params"];
export type CheckEmailAvaiableInputParams = TypeOf<
  typeof checkEmailAvaiableSchema
>["params"];
