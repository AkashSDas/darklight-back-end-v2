import { getModelForClass, prop, Ref, Severity } from "@typegoose/typegoose";
import { SchemaTypes, Types } from "mongoose";
import { CourseClass } from "./course.model";

export class ChapterClass {
  @prop({ type: SchemaTypes.String })
  emoji?: string;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Title is required"],
    maxlength: [240, "Title must be less than 240 characters"],
    minlength: [3, "Title should be more than 3 characters"],
    trim: true,
  })
  title: string;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Descritption is required"],
    maxlength: [1024, "Description must be less than 1024 characters"],
    minlength: [3, "Description should be more than 3 characters"],
    trim: true,
  })
  description: string;

  // https://typegoose.github.io/typegoose/docs/guides/advanced/reference-other-classes/#common-problems
  @prop({
    ref: () => "CourseClass",
    required: [true, "Course is required"],
  })
  courseId: Ref<CourseClass>;

  // ========================================
  // VIRTUALS
  // ========================================

  _id!: Types.ObjectId;
  /** Transformed MongoDB `_id` to `id` */
  public get id() {
    return this._id.toHexString();
  }
}

export const ChapterModel = getModelForClass(ChapterClass, {
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    typeKey: "type",
  },
  options: { allowMixed: Severity.ALLOW, customName: "chapter" },
});
