import { SchemaTypes } from "mongoose";

import { prop } from "@typegoose/typegoose";

import { SocialAuthProvider } from "../utils/user";

/**
 * Social auth provider model which contains info about the provider.
 *
 * Supported providers are:
 * - Google
 * - Facebook
 * - Twitter
 */
export class SocialAuthProviderClass {
  /**
   * Social auth provider id
   * @remark In case there is no id for the provider, then pass empty string
   */
  @prop({
    type: SchemaTypes.String,
    required: [true, "Provider id is required"],
  })
  public id: string;

  /**
   * Social auth provider name. The value should be one of the values in
   * SocialAuthProvider enum (Google, Facebook, Twitter).
   */
  @prop({
    type: SchemaTypes.String,
    required: [true, "Provider name is required"],
    enum: SocialAuthProvider,
  })
  public provider: SocialAuthProvider;
}
