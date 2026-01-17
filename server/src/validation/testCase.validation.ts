import {z} from "zod";

const createTestCaseSchema = z.array(
  z.object({
  questionId : z.string() , 
  input : z.string() , 
  output : z.string() ,
  isHidden : z.boolean().optional()
})
);

export default createTestCaseSchema;