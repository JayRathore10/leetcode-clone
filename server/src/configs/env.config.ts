import dotenv from "dotenv";

dotenv.config({path : `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
  MONGODB_URI , 
  NODE_ENV , 
  COOKIE_SECRET
} = process.env;