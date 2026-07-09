import express  , {Request , Response} from "express";
import cors from "cors";
import { COOKIE_SECRET } from "./configs/env.config";
import { errorMiddleware } from "./middleware/error.middleware";
import { userRouter } from "./routes/user.routes";
import { questionRouter } from "./routes/question.routes";
import { testCaseRouter } from "./routes/testCase.routes";
import cookieParser from "cookie-parser";
import { submissionRouter } from "./routes/submission.routes";
import { authRouter } from "./routes/auth.routes";
import { analyzeRouter } from "./routes/analyze.routes";
import { leaderboardRouter } from "./routes/leaderboard.routes";
import { discussionRouter } from "./routes/discussion.routes";
import { replyRouter } from "./routes/reply.routes";
import { FRONTEND } from "./configs/env.config";

const app = express();

app.use(cors({
  origin: FRONTEND , 
  methods: ["GET", "POST" , "DELETE" , "PUT"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
// app.use("/images", express.static("public/images"));
app.use(
  "/images",
  express.static("public/images", {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
app.use(cookieParser());

app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.get("/test"  , (req : Request , res : Response)=>{
  res.status(200).json({
    message : "Test" , 
  });
});

app.use("/api/users" , userRouter);
app.use("/api/question" , questionRouter);
app.use("/api/testcase" , testCaseRouter);
app.use("/api/submission" , submissionRouter);
app.use("/api/auth" , authRouter);
app.use("/api/analyze" , analyzeRouter);
app.use("/api/leaderboard" , leaderboardRouter);
app.use("/api/discussion" , discussionRouter);
app.use("/api/reply" , replyRouter);

app.use(errorMiddleware);

export default app;

// Add AI Code analysic and also learn to host docker 