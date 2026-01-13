import mongoose from "mongoose";
import { MONGODB_URI , NODE_ENV } from "../configs/env.config";

if(!MONGODB_URI){
  throw new Error("Enter the database env variable");
}

export const connectDatabase = async ()=>{
  try{
    await mongoose.connect(MONGODB_URI as string);
    console.log("Database successfully connected in " , NODE_ENV  , "environment");
  }catch(err){
    console.error("Error in connecting database" , err);
    process.exit(1);
  }
}