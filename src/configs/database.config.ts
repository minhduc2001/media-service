import mongoose from "mongoose";
import { envConfig } from "./env.config";
const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URI, {
      autoCreate: true,
    });

    console.log("MongoDb Connected");
  } catch (e) {
    console.log("lỗi", e);
  }
};
export default connectDB;
