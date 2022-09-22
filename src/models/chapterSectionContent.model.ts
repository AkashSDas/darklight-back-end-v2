import { prop, Ref } from "@typegoose/typegoose";
import { SchemaTypes } from "mongoose";
import { ChapterSectionClass } from "./chapterSection.model";

// enum ChapterSectionContentType {
//   IMAGE = "image",
//   H1 = "h1",
//   H2 = "h2",
//   H3 = "h3",
//   PARAGRAPH = "paragraph",
//   CALLOUT = "callout",
//   QUOTE = "quote",
//   UNORDERED_LIST = "unorderedList",
//   ORDERED_LIST = "orderedList",
//   DIVIDER = "divider",
//   CODE = "code",
// }

export class ChapterSectionContentClass {
  @prop({
    ref: () => ChapterSectionClass,
    required: [true, "Chapter section is required"],
  })
  chapterSectionId: Ref<ChapterSectionClass>;

  @prop({
    type: SchemaTypes.Array,
    required: [true, "Content is required"],
    default: [],
  })
  content: any;
}
