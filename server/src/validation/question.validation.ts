import {z} from "zod";

export const questionSchema = z.object({
  title : z.string() , 
  description : z.string() , 
  difficulty: z.enum(["Easy", "Medium", "Hard"]), 
  tags : z.array(z.string()).default([]), 
  constraints : z.array(z.string()) , 
  example : z.object({
    input : z.string() , 
    output : z.string() ,
    explanation : z.string()
  })
});

