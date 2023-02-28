import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    imgUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const blogModal = mongoose.model("blogs", blogSchema);
