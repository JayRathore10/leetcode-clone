import {z} from "zod";

export const submissionSchema = z.object({
  questionId : z.string() ,
  code : z.string() , 
  language : z.string() ,
  status : z.string() ,
})