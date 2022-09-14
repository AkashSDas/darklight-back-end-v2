import { SchemaTypes } from "mongoose";

import { prop } from "@typegoose/typegoose";

export class UserProfilePic {
  @prop({ type: SchemaTypes.String, required: [true, "Id is required"] })
  public id: string;

  @prop({ type: SchemaTypes.String, required: [true, "URL is required"] })
  public URL: string;
}
