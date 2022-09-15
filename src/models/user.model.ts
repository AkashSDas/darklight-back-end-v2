import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SchemaTypes, Types } from "mongoose";
import { nanoid } from "nanoid";
import validator from "validator";

import { getModelForClass, modelOptions, post, pre, prop, Severity } from "@typegoose/typegoose";

import { BaseApiError } from "../utils/handle-error";
import { SocialAuthProvider, UserRole } from "../utils/user";
import { SocialAuthProviderClass } from "./social-auth-provider.model";
import { UserProfilePic } from "./user-profile-pic.model";

/**
 * User class handling user related operations. It contains:
 * - Properties
 * - Methods
 * - Hooks
 * - Virtuals
 */
@pre<UserClass>("save", async function (next) {
  // Encrypt user's plain text password before saving user

  // Only go ahead if the password was modified (not on other update functions)
  if (!this.isModified("passwordDigest")) return next();

  this.passwordDigest = await bcrypt.hash(this.passwordDigest, 12);
})
@post<UserClass>("save", function (error, user, next) {
  // Handle error for trying to create user with duplicate email
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new BaseApiError(400, `User with email ${user.email} already exists`));
  }
  next();
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    typeKey: "type",
  },
  options: { allowMixed: Severity.ALLOW, customName: "user" },
})
export class UserClass {
  @prop({
    type: SchemaTypes.String,
    unique: true,
    immutable: true,
    default: () => nanoid(12),
    required: [true, "Id is required"],
    maxlength: [12, "Id must be less than 12 characters"],
  })
  public userId: string;

  @prop({
    type: SchemaTypes.String,
    trim: true,
    required: [true, "Fullname is required"],
    maxlength: [240, "Fullname must be less than 240 characters"],
    minlength: [6, "Fullname should be more than 6 characters"],
  })
  public fullName: string;

  @prop({
    type: SchemaTypes.String,
    trim: true,
    unique: true,
    required: [true, "Username is required"],
    maxlength: [120, "Username must be less than 120 characters"],
    minlength: [3, "Username should be more than 3 characters"],
  })
  public username: string;

  @prop({
    type: SchemaTypes.String,
    unique: true,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Email is invalid"],
  })
  public email: string;

  @prop({
    type: SchemaTypes.Boolean,
    required: [true, "Email verification status is required"],
    default: false,
  })
  public emailVerified: boolean;

  @prop({
    type: SchemaTypes.Boolean,
    required: [true, "Account status is required"],
    default: false,
  })
  public isActive: boolean;

  @prop({ type: SchemaTypes.String, select: false })
  public emailVerificationToken?: string;

  @prop({ type: SchemaTypes.Date, select: false })
  public emailVerificationTokenExpiry?: Date;

  /**
   * It's value can be either null OR UserProfilePic sub-document.
   * Profile pic can be removed by the user
   */
  @prop({ type: () => UserProfilePic })
  public profilePic?: UserProfilePic | null;

  @prop({
    type: () => SchemaTypes.Array,
    required: true,
    default: [UserRole.STUDENT],
  })
  public roles: UserRole[];

  @prop({
    type: SchemaTypes.String,
    select: false,
    required: [true, "Password is required"],
  })
  public passwordDigest: string;

  /**
   * It can have a value of null
   */
  @prop({ type: SchemaTypes.String, select: false })
  public passwordResetToken?: string | null;

  /**
   * It can have a value of null
   */
  @prop({ type: SchemaTypes.Date, select: false })
  public passwordResetTokenExpiry?: Date | null;

  /**
   * Array of sub-document
   */
  @prop({ type: () => SocialAuthProviderClass })
  public socialAuthInfo?: SocialAuthProvider[];

  // ========================================
  // INSTANCE METHODS
  // ========================================

  /**
   * Check if the password given by the user is correct or not
   *
   * @param givenPassword The password given by the user
   * @returns {Promise<boolean>} Returns a promise whose value can be either true if the password is correct else false
   */
  async checkPassword(givenPassword: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, this.passwordDigest);
  }

  /**
   * Generate a random token, hash it and then save the hashed token to the user's document along with an
   * expiry date of 10mins.
   *
   * @returns {string} Returns the reset token (not hashed i.e. not the one that is stored in the database)
   */
  generatePasswordResetToken(): string {
    /**
     * This token will be sent to the user and user will sent this back to the back-end
     * while reseting password. The token given by user will be hashed and checked
     * (`passwordResetToken`) if its valid OR not. If its valid and not expired
     * (`passwordResetTokenExpiry`) then password will be reset.
     */
    const token = crypto.randomBytes(20).toString("hex");

    // Hash the token and store it in the database
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Set the token expiry to 10 minutes
    this.passwordResetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    return token;
  }

  /**
   * Generate a random token, hash it and then save the hashed token to the user's document along with an
   * expiry date of 10mins.
   *
   * @returns {string} Returns the email verification token (not hashed i.e. not the one that is stored in the database)
   */
  generateEmailVerificationToken(): string {
    /**
     * This token will be sent to the user and user will sent this back to the back-end
     * while verifying the email. The token given by user will be hashed and checked
     * (`emailVerificationToken`) if its valid OR not. If its valid and not expired
     * (`emailVerificationTokenExpiry`), then the email will be verified and account
     * will be set to active.
     */
    const token = crypto.randomBytes(20).toString("hex");

    // Hash the token and store it in the database
    this.emailVerificationToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Set the token expiry to 10 minutes
    this.emailVerificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    return token;
  }

  generateAccessToken(): string {
    const payload = {
      id: this._id,
      userId: this.userId,
      username: this.username,
      email: this.email,
    };

    // short duration token, new one is generated with valid refresh token
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
  }

  generateRefreshToken(): string {
    const payload = {
      id: this._id,
      userId: this.userId,
      username: this.username,
      email: this.email,
    };

    // long duration but does expires
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1m",
    });
  }

  // ========================================
  // VIRTUALS
  // ========================================

  _id!: Types.ObjectId;
  /** Transformed MongoDB `_id` to `id` */
  public get id() {
    return this._id.toHexString();
  }
}

/** User model generated using Typegoose */
export const UserModel = getModelForClass(UserClass);
