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
jest.mock("axios");
const mockedAxios = axios_1.default;
describe("POST /api/analyze", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return 400 when code or language is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/analyze")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            error: "Code and language are required"
        });
    }));
    it("should return 200 with analysis", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.post.mockResolvedValue({
            data: {
                choices: [
                    {
                        message: {
                            content: "This code adds two numbers."
                        }
                    }
                ]
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/analyze")
            .send({
            code: "int main(){ return 0; }",
            language: "cpp",
            problem: "Dummy problem"
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            analysis: "This code adds two numbers."
        });
    }));
    it("should handle empty AI response", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.post.mockResolvedValue({
            data: {}
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/analyze")
            .send({
            code: "int main(){ return 0; }",
            language: "cpp"
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            analysis: "No analysis generated."
        });
    }));
    it("should return 500 when axios fails", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.post.mockRejectedValue({
            response: {
                data: "API Error"
            }
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/analyze")
            .send({
            code: "int main(){ return 0; }",
            language: "cpp"
        });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            success: false,
            error: "API Error"
        });
    }));
});
// task for tommorow 
