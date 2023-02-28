import mongoose from "mongoose";

const connectUri = process.env.MongoDbUri;

mongoose.set("strictQuery", true);

export const connectDB = async () => {
  try {
    await mongoose.connect(connectUri, {
      useNewUrlParser: true,
      autoIndex: true,
    });
  } catch (error) {
    console.log(error);
  }
};
