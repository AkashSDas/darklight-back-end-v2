import { object, TypeOf } from "zod";
import { zodUserEmail, zodUserId, zodUserUsername } from "./base.schema";

// =================================
// SCHEMAS
// =================================

export const checkUsernameAvaiableSchema = object({
  params: object({ username: zodUserUsername }),
});

export const checkEmailAvaiableSchema = object({
  params: object({ email: zodUserEmail }),
});

export const signupForInstructorSchema = object({
  params: object({ userId: zodUserId }),
});

// =================================
// TYPES
// =================================

export type CheckUsernameAvaiableInput = TypeOf<
  typeof checkUsernameAvaiableSchema
>;
export type CheckEmailAvaiableInput = TypeOf<typeof checkEmailAvaiableSchema>;
export type SignupForInstructorInput = TypeOf<typeof signupForInstructorSchema>;
