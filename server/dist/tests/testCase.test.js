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
const axios_1 = __importDefault(require("axios"));
const testCase_model_1 = require("../models/testCase.model");
jest.mock("../models/question.model.ts");
jest.mock("../models/testCase.model.ts");
jest.mock("../middleware/auth.middleware", () => ({
    isUserLoggedIn: (req, res, next) => next()
}));
jest.mock("axios");
const mockedAxios = axios_1.default;
describe("GET /api/testcase/visible/:questionId", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 404 when no visible test cases found", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/testcase/visible/123");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Test Cases are not found"
        });
    }));
    it("should return 200 with visible test cases", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTestCases = [
            { input: "1 2", output: "3", isHidden: false },
            { input: "2 3", output: "5", isHidden: false }
        ];
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/testcase/visible/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "These are the test cases",
            testCases: mockTestCases
        });
    }));
});
describe("GET /api/testcase/hidden/:questionId", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 404 when no hidden test cases found", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/testcase/hidden/123");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "No test Case found"
        });
    }));
    it("should return 200 with hidden test cases", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTestCases = [
            { input: "1 2", output: "3", isHidden: true },
            { input: "2 3", output: "5", isHidden: true }
        ];
        testCase_model_1.testCaseModel.find.mockResolvedValue(mockTestCases);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/testcase/hidden/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "These are all hidden test cases",
            testCases: mockTestCases
        });
    }));
});
describe("POST /api/testcase/add", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 400 when validation fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/testcase/add")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    }));
    it("should return 400 when test case is not created", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.insertMany.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/testcase/add")
            .send([
            {
                input: "1 2",
                output: "3",
                questionId: "123",
                isHidden: false
            }
        ]);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "New Test case is not created"
        });
    }));
    it("should return 201 when test cases are created", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = [
            {
                input: "1 2",
                output: "3",
                questionId: "123",
                isHidden: false
            }
        ];
        testCase_model_1.testCaseModel.insertMany.mockResolvedValue(mockData);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/testcase/add")
            .send(mockData);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            success: true,
            message: "New Test Case Created",
            newTestCases: mockData
        });
    }));
});
describe("DELETE /api/testcase/delete/:testCaseId", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 404 when test case not found", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.findByIdAndDelete.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/testcase/delete/123");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Not Test Case found"
        });
    }));
    it("should return 200 when test case is deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        testCase_model_1.testCaseModel.findByIdAndDelete.mockResolvedValue({
            _id: "123"
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/testcase/delete/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "This test case deleted"
        });
    }));
});
