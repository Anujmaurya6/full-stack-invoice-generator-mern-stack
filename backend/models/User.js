import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    plan: {
      type: String,
      enum: ["FREE", "BASIC", "PRO"],
      default: "FREE"
    },

    logo: String,
    signature: String
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);