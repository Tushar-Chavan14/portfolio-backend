import { v2 as cloudinary } from "cloudinary";
import DataURI from "datauri";

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_SECRET_API_KEY,
});

export const setFiles = async (req, res, next) => {
  const dataUri = new DataURI();

  if (req.file) {
    dataUri.format(".png", req.file.buffer);

    const response = await cloudinary.uploader.upload(dataUri.content, {
      public_id: req.file.originalname.replace(".png", ""),
    });
    if (!response) {
      throw new Error("something went wrong");
    }
    req.imgURI = response.secure_url;
  }

  next();
};
