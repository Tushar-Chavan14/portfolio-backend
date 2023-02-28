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
      required: true,
      trim: true,
    },
    tech: {
      type: String,
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
