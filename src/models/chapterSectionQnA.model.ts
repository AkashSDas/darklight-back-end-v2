import { prop, Ref } from "@typegoose/typegoose";
import { SchemaTypes } from "mongoose";
import { ChapterSectionClass } from "./chapterSection.model";
import { ChapterSectionQnAReplyClass } from "./chapterSectionQnAReply.model";

export class ChapterSectionQnAClass {
  @prop({
    ref: () => ChapterSectionClass,
    required: [true, "Chapter section is required"],
  })
  chapterSectionId: Ref<ChapterSectionClass>;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Question is required"],
    minlength: [1, "Question must be at least 1 character"],
    maxlength: [1000, "Question must be at most 1000 characters"],
  })
  question: string;

  @prop({
    type: SchemaTypes.Boolean,
    required: [true, "Is answer is required"],
    default: false,
  })
  answered: string;

  @prop({
    type: () => ChapterSectionQnAReplyClass,
    required: [true, "Replies is required"],
    default: [],
  })
  replies: ChapterSectionQnAReplyClass[];
}
