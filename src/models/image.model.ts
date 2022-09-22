import { prop } from "@typegoose/typegoose";
import { SchemaTypes } from "mongoose";

export class CoverImageClass {
  @prop({ type: SchemaTypes.String })
  public id?: string;

  @prop({
    type: SchemaTypes.String,
    required: [true, "Image url is required"],
  })
  public URL: string;
}
