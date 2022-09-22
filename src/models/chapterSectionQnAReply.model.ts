import { prop } from "@typegoose/typegoose";
import { SchemaTypes } from "mongoose";

export class ChapterSectionQnAReplyClass {
  @prop({
    type: SchemaTypes.String,
    required: [true, "Reply is required"],
    minlength: [1, "Reply must be at least 1 character"],
    maxlength: [1000, "Reply must be at most 1000 characters"],
  })
  content: string;

  @prop({
    type: SchemaTypes.Number,
    required: [true, "Reply usefulness is required"],
    min: [0, "Reply usefulness must be at least 0"],
    default: 0,
  })
  usefulCount: number;

  @prop({ type: SchemaTypes.Date, required: [true, "Reply date is required"] })
  repliedAt: Date;

  @prop({
    type: SchemaTypes.Boolean,
    required: [true, "Is answer is required"],
    default: false,
  })
  isAnswer: boolean;
}
