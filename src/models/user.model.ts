import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SchemaTypes, Types } from "mongoose";
import validator from "validator";

import { getModelForClass, modelOptions, post, pre, prop, Severity } from "@typegoose/typegoose";

import { BaseApiError } from "../utils/handle-error";

// ===============================
// Enums
// ===============================

export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

// ===============================
// Typegoose schema classes
// ===============================

/** User profile image sub-document class */
class ProfileImage {
  /** id of the image saved in the cloud */
  @prop({ type: SchemaTypes.String, required: true })
  id: string;

  @prop({ type: SchemaTypes.String, required: true })
  URL: string;
}

/** User model class */
@pre<UserClass>("save", async function encryptPassword(next) {
  // Encrypt user's plain text password before saving user
  // Only go ahead if the password was modified (not on other update functions)
  if (!this.isModified("passwordDigest")) return next();
  this.passwordDigest = await bcrypt.hash(this.passwordDigest, 12);
})
@post<UserClass>("save", function handleDuplicateUserError(err, user, next) {
  // Handle error due to user trying to create user with duplicate fields (email OR username)
  if (err.name == "MongoServerError" && err.code == 11000) {
    next(new BaseApiError(400, "Username OR email already used"));
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
    required: [true, "Full name is required"],
    maxlength: [240, "Max length can be 240 characters"],
    minlength: [6, "Minimum length should be 6 characters"],
    trim: true,
  })
  fullName: string;

  @prop({
    type: SchemaTypes.String,
    maxlength: [120, "Max length can be 120 characters"],
    minlength: [3, "Minimum length should be 3 characters"],
    unique: true,
    trim: true,
  })
  username?: string;

  @prop({
    type: SchemaTypes.String,
    validate: [validator.isEmail, "Email is invalid"],
    unique: true,
  })
  email?: string;

  @prop({
    type: SchemaTypes.Boolean,
    required: [true, "Email verification status is required"],
    default: false,
  })
  isEmailVerified: boolean;

  @prop({ type: SchemaTypes.String, select: false })
  emailVerificationToken?: string | null;

  @prop({ type: SchemaTypes.Date, select: false })
  emailVerificationTokenExpiry?: Date | null;

  @prop({
    type: () => SchemaTypes.Array,
    required: [true, "User privileges are required"],
    default: [UserRole.STUDENT],
  })
  roles: UserRole[];

  @prop({ type: SchemaTypes.String, select: false })
  passwordDigest?: string;

  @prop({ type: SchemaTypes.String, select: false })
  passwordResetToken?: string | null;

  @prop({ type: SchemaTypes.Date, select: false })
  passwordResetTokenExpiry?: Date | null;

  /** @remarks Users can unset their profile image */
  @prop({ type: () => ProfileImage })
  profileImage?: ProfileImage | null;

  // ===============================
  // Instance methods
  // ===============================

  /**
   * Check if the password given by the user is correct or not
   * @param givenPwd The password given by the user
   * @returns Promise whose value is either true Or false
   */
  async checkPassword(givenPwd: string): Promise<boolean> {
    return await bcrypt.compare(givenPwd, this.passwordDigest);
  }

  /**
   * Generate a random token, hash it and then save the hashed token to the user's document along with an
   * expiry date of 10mins.
   *
   * @returns Reset token (not hashed i.e. not the one that is stored in the database)
   */
  getPwdResetToken(): string {
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
   * @returns Email verification token (not hashed i.e. not the one that is stored in the database)
   */
  getEmailVerificationToken(): string {
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

  /** Generate access token for JWT authentication method */
  getAccessToken(): string {
    let payload = { id: this._id, username: this.username, email: this.email };
    // long duration but does expires
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20m",
    });
  }

  /** Generate refresh token for JWT authentication method */
  getRefreshToken(): string {
    let payload = { id: this._id, username: this.username, email: this.email };
    // long duration but does expires
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "60m",
    });
  }

  // ===============================
  // Virtuals
  // ===============================

  _id!: Types.ObjectId;
  /** Transformed MongoDB `_id` to `id` */
  get id() {
    return this._id.toHexString();
  }
}

export const UserModel = getModelForClass(UserClass);
