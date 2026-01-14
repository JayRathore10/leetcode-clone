import express  , {Request , Response} from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { userRouter } from "./routes/user.routes";
import { questionRouter } from "./routes/question.routes";
import { testCaseRouter } from "./routes/testCase.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/users" , userRouter);
app.use("/question" , questionRouter);
app.use("/testcase" , testCaseRouter);

app.use(errorMiddleware);

export default app;
