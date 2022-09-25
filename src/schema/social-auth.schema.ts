import { object, TypeOf } from "zod";
import { zodUserEmail, zodUserFullName, zodUserUsername } from "./base.schema";

// =================================
// SCHEMAS
// =================================

export const addPostOAuthUserInfoSchema = object({
  body: object({
    fullName: zodUserFullName,
    username: zodUserUsername,
    email: zodUserEmail,
  }),
});

// =================================
// TYPES
// =================================

export type AddPostOAuthUserInfoSchemaInput = TypeOf<
  typeof addPostOAuthUserInfoSchema
>;
