import { getModelForClass, prop, Ref, Severity } from "@typegoose/typegoose";
import { SchemaTypes, Types } from "mongoose";
import { CoverImageClass } from "./image.model";
import { UserClass } from "./user.model";

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum CourseStage {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export class CourseClass {
  @prop({
    type: String,
    required: [true, "Course name is required"],
    maxlength: [240, "Course name must be less than 240 characters"],
    minlength: [3, "Course name should be more than 3 characters"],
  })
  title: string;

  @prop({
    type: String,
    required: [true, "Course description is required"],
    maxlength: [1024, "Course description must be less than 1024 characters"],
    minlength: [3, "Course description should be more than 3 characters"],
  })
  description: string;

  @prop({
    ref: () => UserClass,
    required: [true, "Course author is required"],
  })
  instructors: Ref<UserClass>[];

  @prop({
    type: SchemaTypes.String,
    required: [true, "Tags for course are required"],
  })
  tags: string[];

  @prop({
    type: SchemaTypes.String,
    required: [true, "Course level is required"],
    enum: CourseLevel,
  })
  courseLevel: CourseLevel;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Course stage is required"],
    enum: CourseStage,
  })
  stage: CourseStage;

  @prop({
    type: SchemaTypes.Number,
    required: [true, "Course price is required"],
    min: [0, "Course price must be greater than 0"],
  })
  price: number;

  @prop({ type: () => CoverImageClass })
  coverImage?: CoverImageClass | null;

  // ========================================
  // VIRTUALS
  // ========================================

  _id!: Types.ObjectId;
  /** Transformed MongoDB `_id` to `id` */
  public get id() {
    return this._id.toHexString();
  }
}

export const CourseModel = getModelForClass(CourseClass, {
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    typeKey: "type",
  },
  options: { allowMixed: Severity.ALLOW, customName: "course" },
});
