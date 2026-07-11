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
describe("GET /api/leaderboard", () => {
    it("should return leaderboard successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        submission_model_1.submissionModel.aggregate.mockResolvedValue([
            {
                username: "jay",
                profilePic: "jay.jpg",
                problemsSolved: 10,
            },
            {
                username: "rahul",
                profilePic: "rahul.jpg",
                problemsSolved: 8,
            },
        ]);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/leaderboard");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.leaderboard).toBeDefined();
        expect(res.body.leaderboard.length).toBe(2);
        expect(res.body.leaderboard[0].username).toBe("jay");
        expect(res.body.leaderboard[0].problemsSolved).toBe(10);
    }));
    it("should return empty leaderboard if no submissions exist", () => __awaiter(void 0, void 0, void 0, function* () {
        submission_model_1.submissionModel.aggregate.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/leaderboard");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.leaderboard).toEqual([]);
    }));
});
