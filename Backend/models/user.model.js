import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    assistantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Usermodel = mongoose.model("User", userSchema);
