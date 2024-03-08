import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const memberSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    community: {
      type: String,
      ref: "Community",
    },
    user: {
      type: String,
      ref: "User",
    },
    role: {
      type: String,
      ref: "Role",
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
