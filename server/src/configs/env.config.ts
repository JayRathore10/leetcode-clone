import dotenv from "dotenv";

dotenv.config({path : `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
  MONGODB_URI , 
  NODE_ENV , 
  COOKIE_SECRET , 
  SALT_ROUND , 
  JWT_SECRET, 
  GEMINI_API_KEY
} = process.env;