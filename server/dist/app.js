"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error.middleware");
const user_routes_1 = require("./routes/user.routes");
const question_routes_1 = require("./routes/question.routes");
const testCase_routes_1 = require("./routes/testCase.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const submission_routes_1 = require("./routes/submission.routes");
const auth_routes_1 = require("./routes/auth.routes");
const analyze_routes_1 = require("./routes/analyze.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/images", express_1.default.static("public/images"));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Hi, Jexts here!");
});
app.use("/api/users", user_routes_1.userRouter);
app.use("/api/question", question_routes_1.questionRouter);
app.use("/api/testcase", testCase_routes_1.testCaseRouter);
app.use("/api/submission", submission_routes_1.submissionRouter);
app.use("/api/auth", auth_routes_1.authRouter);
app.use("/api/analyze", analyze_routes_1.analyzeRouter);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
