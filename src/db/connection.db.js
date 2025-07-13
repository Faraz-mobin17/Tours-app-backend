import mongoose from "mongoose";
import { env } from "../../config/serverConfig.js";
import { DB_NAME } from "../utils/constants.js";

const connectDB = async (
  connectionString = `${env.MONGODB_URI}/${DB_NAME}` ||
    `mongodb://127.0.0.1:27017/${DB_NAME}`
) => {
  try {
    const connectionInstance = await mongoose.connect(connectionString);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection error", error);
    throw error;
  }
};

export default connectDB;
