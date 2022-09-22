import { prop } from "@typegoose/typegoose";
import { SchemaTypes } from "mongoose";

enum VideoType {
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
  SELF = "self",
}

export class VideoClass {
  @prop({ type: SchemaTypes.String })
  public id?: string;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Image url is required"],
  })
  public URL: string;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Source is required"],
    enum: VideoType,
  })
  public source: string;

  @prop({
    type: SchemaTypes.Number,
    required: [true, "Video length is required"],
  })
  public videoLength: number;
}
