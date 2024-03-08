import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const roleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
