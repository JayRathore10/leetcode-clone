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
const submission_model_1 = require("../models/submission.model");
jest.mock("../models/submission.model");
jest.mock("../middleware/auth.middleware", () => ({
    isUserLoggedIn: (req, res, next) => {
        req.user = { _id: "user123" };
        next();
    }
}));
describe("POST /api/submission", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 400 when validation fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/submission")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body).toHaveProperty("error");
    }));
    it("should return 400 when submission is not created", () => __awaiter(void 0, void 0, void 0, function* () {
        submission_model_1.submissionModel.create.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/submission")
            .send({
            questionId: "1",
            code: "test",
            language: "cpp",
            status: "Accepted",
            title: "Two Sum"
        });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "Error in creating Submission"
        });
    }));
    it("should return 201 when submission is created", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSubmission = {
            _id: "1",
            questionId: "1",
            code: "test",
            language: "cpp",
            status: "Accepted",
            title: "Two Sum",
            userId: "user123"
        };
        submission_model_1.submissionModel.create.mockResolvedValue(mockSubmission);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/submission")
            .send({
            questionId: "1",
            code: "test",
            language: "cpp",
            status: "Accepted",
            title: "Two Sum"
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            success: true,
            message: "New Submission Created",
            submission: mockSubmission
        });
    }));
});
describe("GET /api/submission", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 200 when no submissions exist", () => __awaiter(void 0, void 0, void 0, function* () {
        submission_model_1.submissionModel.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/submission");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: false,
            message: "User don't have any submissions"
        });
    }));
    it("should return 200 with user submissions", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = [{ _id: "1" }];
        submission_model_1.submissionModel.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockData)
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/submission");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "User's All Submissions",
            submissions: mockData
        });
    }));
});
describe("GET /api/submission/:id", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 404 when submission not found", () => __awaiter(void 0, void 0, void 0, function* () {
        submission_model_1.submissionModel.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/submission/123");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Submission not found"
        });
    }));
    it("should return 200 when submission is found", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSubmission = { _id: "123" };
        submission_model_1.submissionModel.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockSubmission)
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/submission/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            messaage: "Submission",
            submission: mockSubmission
        });
    }));
});
