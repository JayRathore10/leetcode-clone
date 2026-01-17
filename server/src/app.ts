import express  , {Request , Response} from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import { userRouter } from "./routes/user.routes";
import { questionRouter } from "./routes/question.routes";
import { testCaseRouter } from "./routes/testCase.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST" , "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})


app.use("/api/users" , userRouter);
app.use("/api/question" , questionRouter);
app.use("/api/testcase" , testCaseRouter);

app.use(errorMiddleware);

export default app;
