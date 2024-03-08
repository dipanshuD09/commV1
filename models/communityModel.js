import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const communitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      required: true,
      validator: (value) => {
        return validator.isAlpha(value.replace(/\s+/g, ''), 'en-US', { ignore: ' -' }); // Allows spaces and hyphens
      },
    },
    slug: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;
