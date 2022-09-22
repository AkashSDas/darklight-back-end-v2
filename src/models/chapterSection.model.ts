import { getModelForClass, prop, Ref, Severity } from "@typegoose/typegoose";
import { SchemaTypes, Types } from "mongoose";
import { ChapterClass } from "./chapter.model";
import { CourseClass } from "./course.model";
import { VideoClass } from "./video.model";

export class ChapterSectionClass {
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

  @prop({ ref: () => CourseClass, required: [true, "Course is required"] })
  courseId: Ref<CourseClass>;

  @prop({ ref: () => ChapterClass, required: [true, "Chapter is required"] })
  chapterId: Ref<ChapterClass>;

  @prop({ type: SchemaTypes.Number, required: [true, "Order is required"] })
  order: number;

  @prop({ type: SchemaTypes.Date, required: [true, "Last edited is required"] })
  lastEditedOn: number;

  @prop({
    type: SchemaTypes.Boolean,
    required: [true, "Free status is required"],
    default: false,
  })
  free: boolean;

  @prop({ type: () => VideoClass })
  video: boolean;

  // ========================================
  // VIRTUALS
  // ========================================

  _id!: Types.ObjectId;
  /** Transformed MongoDB `_id` to `id` */
  public get id() {
    return this._id.toHexString();
  }
}

export const ChapterSectionModel = getModelForClass(CourseClass, {
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    typeKey: "type",
  },
  options: { allowMixed: Severity.ALLOW, customName: "chapterSection" },
});
