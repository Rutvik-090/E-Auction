import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected!");
  } catch (error) {
    console.log("Database connection error");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;
