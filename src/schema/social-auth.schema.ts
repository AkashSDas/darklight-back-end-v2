import { object, string, TypeOf } from "zod";

export const updateUsernameSchema = object({
  body: object({
    username: string({ required_error: "Username is required" })
      .max(120, "Username must be less than 120 characters")
      .min(3, "Username should be more than 3 characters"),
  }),
});

export type UpdateUsernameInputBody = TypeOf<
  typeof updateUsernameSchema
>["body"];
