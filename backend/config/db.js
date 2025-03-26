import { connect } from 'mongoose';
import { MONGO_URI } from './config.js';

const connectDB = async () => {
  try {
    const conn = await connect(MONGO_URI, {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
