import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    tech: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },
    link: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const portfolioModel = mongoose.model("projects", portfolioSchema);
