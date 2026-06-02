"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const question_model_1 = require("../models/question.model");
const axios_1 = __importDefault(require("axios"));
const testCase_model_1 = require("../models/testCase.model");
jest.mock("../models/question.model.ts");
jest.mock("../models/testCase.model.ts");
jest.mock("../middleware/auth.middleware", () => ({
    isUserLoggedIn: (req, res, next) => next()
}));
jest.mock("axios");
const mockedAxios = axios_1.default;
describe("DELETE /api/question/delete/:questionId", () => {
    it("should return 404 when question not found in database for deletion", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.findByIdAndDelete.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default).
            delete("/api/question/delete/1234");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Question Not found"
        });
    }));
    it("should return 200 when it successfully delete question", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.findByIdAndDelete.mockResolvedValue({
            _id: "1234"
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            delete("/api/question/delete/1234");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "Question delete successfully"
        });
    }));
});
describe("POST /api/question/add", () => {
    it("should return 400 when validation fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/question/add")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    }));
    it("should return 400 when there is an error in creating new question in database", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.create.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/add")
            .send({
            title: "Two Sum",
            description: "desc",
            difficulty: "Easy",
            tags: ["array"],
            constraints: ["1 <= n <= 10^5"],
            example: {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] = 9"
            }
        });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "New Question is not created"
        });
    }));
    it("should return 201 when new question is successfully created", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.create.mockReturnValue({
            title: "Two Sum",
            description: "desc",
            difficulty: "Easy",
            tags: ["array"],
            constraints: ["1 <= n <= 10^5"],
            example: {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] = 9"
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/add")
            .send({
            title: "Two Sum",
            description: "desc",
            difficulty: "Easy",
            tags: ["array"],
            constraints: ["1 <= n <= 10^5"],
            example: {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] = 9"
            }
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            success: true,
            message: "New Question Created",
            data: {
                newQuestion: {
                    title: "Two Sum",
                    description: "desc",
                    difficulty: "Easy",
                    tags: ["array"],
                    constraints: ["1 <= n <= 10^5"],
                    example: {
                        input: "nums = [2,7,11,15], target = 9",
                        output: "[0,1]",
                        explanation: "Because nums[0] + nums[1] = 9"
                    }
                }
            }
        });
    }));
});
describe("GET /api/question/all", () => {
    it("should return 404 when there is not question in database", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/question/all");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "There is not question in database"
        });
    }));
    it("should return 200 when successfully return all question present in databases", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.find.mockResolvedValue(["1"]);
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/question/all");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "This are all questions",
            questions: ["1"]
        });
    }));
});
describe("POST /api/question/run", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 400 when the req fields are not present", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "Code  , language or questionId is not mentioned"
        });
    }));
    it("should return 404 when no test cases found", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "print()"
        });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Not Test Case found"
        });
    }));
    const mockTestCases = [
        { input: "1 2", output: "3" }
    ];
    it("should return compilation error", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                compile: { stderr: "syntax error" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "wrong code"
        });
        expect(res.body.status).toBe("WA");
        expect(res.body.errorType).toBe("Compilation Error");
    }));
    it("should return TLE", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { signal: "SIGXCPU" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "while(true){}"
        });
        expect(res.body.status).toBe("TLE");
        expect(res.body.failedTest).toBe(1);
    }));
    it("should return MLE", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { signal: "SIGSEGV" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "huge memory"
        });
        expect(res.body.status).toBe("MLE");
    }));
    it("should return runtime error", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { stderr: "runtime crash" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "divide by zero"
        });
        expect(res.body.errorType).toBe("Runtime Error");
    }));
    it("should return WA when output mismatches", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { stdout: "5" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "wrong logic"
        });
        expect(res.body.status).toBe("WA");
        expect(res.body.expected).toBe("3");
        expect(res.body.actual).toBe("5");
    }));
    it("should return success when all test cases pass", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue([
            { input: "1 2", output: "3" },
            { input: "2 3", output: "5" }
        ]);
        mockedAxios.post
            .mockResolvedValueOnce({
            data: { run: { stdout: "3" } }
        })
            .mockResolvedValueOnce({
            data: { run: { stdout: "5" } }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/run")
            .send({
            questionId: "123",
            language: "cpp",
            code: "correct code"
        });
        expect(res.body.success).toBe(true);
        expect(res.body.result.length).toBe(2);
    }));
});
describe("POST /api/question/submit", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 404 when required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({});
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    }));
    it("should return 404 when no test cases found", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({
            questionId: "1",
            code: "test",
            language: "cpp"
        });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Test Cases are not present"
        });
    }));
    const mockTestCases = [
        { input: "1 2", output: "3" }
    ];
    it("should return compilation error", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                compile: { stderr: "syntax error" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({
            questionId: "1",
            code: "wrong",
            language: "cpp"
        });
        expect(res.body.status).toBe("WA");
        expect(res.body.errorType).toBe("Compilation Error");
    }));
    it("should return TLE", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { signal: "SIGXCPU" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({
            questionId: "1",
            code: "loop",
            language: "cpp"
        });
        expect(res.body.status).toBe("TLE");
        expect(res.body.failedTest).toBe(1);
    }));
    it("should return MLE", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { signal: "SIGSEGV" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({
            questionId: "1",
            code: "memory",
            language: "cpp"
        });
        expect(res.body.status).toBe("MLE");
    }));
    it("should return WA when output mismatches", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        mockedAxios.post.mockResolvedValue({
            data: {
                run: { stdout: "5" }
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({
            questionId: "1",
            code: "wrong",
            language: "cpp"
        });
        expect(res.body.status).toBe("WA");
        expect(res.body.expected).toBe("3");
        expect(res.body.actual).toBe("5");
    }));
    it("should return Accepted when all test cases pass", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue([
            { input: "1 2", output: "3" },
            { input: "2 3", output: "5" }
        ]);
        mockedAxios.post
            .mockResolvedValueOnce({
            data: { run: { stdout: "3" } }
        })
            .mockResolvedValueOnce({
            data: { run: { stdout: "5" } }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/question/submit")
            .send({
            questionId: "1",
            code: "correct",
            language: "cpp"
        });
        expect(res.body.success).toBe(true);
        expect(res.body.status).toBe("Accepted");
        expect(res.body.totalTest).toBe(2);
    }));
});
describe("GET /api/question/total", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 400 when no questions exist", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/question/total");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "There are no questions in database"
        });
    }));
    it("should return 200 with total number of questions", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.find.mockResolvedValue([
            { _id: "1" },
            { _id: "2" },
            { _id: "3" }
        ]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/question/total");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "Total Number of Questions",
            totalQuestion: 3
        });
    }));
});
describe("GET /api/question/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 404 when question not found", () => __awaiter(void 0, void 0, void 0, function* () {
        question_model_1.questionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/question/123");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Question not found"
        });
    }));
    it("should return 200 when question is found", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockQuestion = {
            _id: "123",
            title: "Two Sum"
        };
        question_model_1.questionModel.findById.mockResolvedValue(mockQuestion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/question/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "This is Question",
            question: mockQuestion
        });
    }));
});
