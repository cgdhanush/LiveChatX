import mongoose from "mongoose";
import { log } from "node:console";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      await mongoose.connect(uri);
      log("MongoDB connected");
    } else {
      log("Please add uri in .env file");
      process.exit(1);
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
