import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
export const NODE_ENV = process.env.NODE_ENV;

