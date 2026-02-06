import mongoose from "mongoose";
import {Types} from "mongoose";
import { maxLength, minLength } from "zod";
import { Document } from "mongoose";

export interface UserInterface extends Document{
  _id : Types.ObjectId;
  username ?: string , 
  name ?: string , 
  email ?: string , 
  password : string  , 
  role ?: "user" | "admin" ,
  createdAt ?: Date , 
  profilePic ?: string 
}

const userSchmea = new mongoose.Schema<UserInterface>({
  username : {
    type : String , 
    required : [true , "username is required"] , 
    minLength : 3 , 
    maxLength : 20 , 
    unique : true 
  } , 
  name : {
    type : String , 
    required : [true , "name is required"]  , 
    minLength : 2 , 
    maxLength : 20 
  }, 
  email : {
    type : String , 
    required : [true, "Email is required"] , 
    trim : true , 
    unique : true  ,
    lowercase : true , 
    match : [/\S+@\S+\.\S+/, 'Please fill a valid email address']
  } , 
  password : {
    type : String , 
    required : [true , "Password is required"] ,
    minLength : 6
  } ,
  role : {
    type : String  ,
    enum : ["user" , "admin"], 
    default : "user"
  } ,
  createdAt : {
    type : Date , 
    default : Date.now
  } ,
  profilePic : {
    type : String  , 
    default : "default.jpg" 
  }
} , {timestamps : true});

export const userModel = mongoose.model<UserInterface>("User" , userSchmea);

