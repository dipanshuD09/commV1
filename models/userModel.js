import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isStrongPassword(value, {
            minLength: 8,
            minUppercase: 1,
            minNumbers:1,
            minSymbols: 0,
        }),
        message: "Too weak",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//hashing password before storing in db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
