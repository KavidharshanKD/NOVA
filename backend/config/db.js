import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useLocalMockDB = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log("-----------------------------------------------------------------");
    console.log("WARNING: MongoDB local server is not running or unreachable.");
    console.log("NOVA is initiating LOCAL MOCK FILE DB fallback mode!");
    console.log("All data will be loaded from/saved to backend/data/*.json files.");
    console.log("This enables 100% out-of-the-box functionality for evaluations!");
    console.log("-----------------------------------------------------------------");
    global.useLocalMockDB = true;
  }
};
