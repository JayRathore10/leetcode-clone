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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const contest_model_1 = require("../models/contest.model");
const user_model_1 = require("../models/user.model");
jest.mock("../models/contest.model");
jest.mock("../models/user.model");
jest.mock("jsonwebtoken");
describe("POST /api/contest", () => {
    it("should create contest successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
            role: "admin",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "admin@gmail.com",
                username: "admin",
            }),
        });
        contest_model_1.contestModel.create.mockResolvedValue({
            title: "Weekly Contest",
            description: "Contest Description",
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Contest",
            description: "Updated Description",
            startTime: new Date("2030-01-02T10:00:00.000Z"),
            endTime: new Date("2030-01-02T12:00:00.000Z"),
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Contest created successfully.");
    }));
    it("should return 401 if token is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest")
            .send({
            title: "Contest",
        });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Token not Found");
    }));
    it("should return 401 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Contest",
        });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    }));
});
describe("GET /api/contest", () => {
    it("should return all contests", () => __awaiter(void 0, void 0, void 0, function* () {
        contest_model_1.contestModel.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue([
                    {
                        title: "Contest 1",
                    },
                    {
                        title: "Contest 2",
                    },
                ]),
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/contest");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.contests).toBeDefined();
        expect(res.body.contests.length).toBe(2);
    }));
});
describe("GET /api/contest/:contestId", () => {
    it("should return contest by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const populate3 = jest.fn().mockResolvedValue({
            _id: "contest123",
            title: "Weekly Contest",
        });
        const populate2 = jest.fn().mockReturnValue({
            populate: populate3,
        });
        const populate1 = jest.fn().mockReturnValue({
            populate: populate2,
        });
        contest_model_1.contestModel.findById.mockReturnValue({
            populate: populate1,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/contest/contest123");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.contest.title).toBe("Weekly Contest");
    }));
    it("should return 404 if contest is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const populate3 = jest.fn().mockResolvedValue(null);
        const populate2 = jest.fn().mockReturnValue({
            populate: populate3,
        });
        const populate1 = jest.fn().mockReturnValue({
            populate: populate2,
        });
        contest_model_1.contestModel.findById.mockReturnValue({
            populate: populate1,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/contest/123");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest not found.");
    }));
});
describe("PUT /api/contest/:contestId", () => {
    it("should update contest successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
            role: "admin",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "admin@gmail.com",
                username: "admin",
            }),
        });
        const contest = {
            _id: "contest123",
            title: "Old Contest",
            description: "Old Description",
            startTime: new Date("2030-01-01T10:00:00.000Z"),
            endTime: new Date("2030-01-01T12:00:00.000Z"),
            duration: 120,
            status: "Upcoming",
            save: jest.fn().mockResolvedValue(true),
        };
        contest_model_1.contestModel.findById.mockResolvedValue(contest);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/contest/contest123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Contest",
            description: "Updated Description",
            startTime: new Date("2030-01-02T10:00:00.000Z"),
            endTime: new Date("2030-01-02T12:00:00.000Z"),
        });
        ;
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Contest updated successfully.");
    }));
    it("should return 404 if contest is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
            role: "admin",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "admin@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/contest/contest123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Contest",
        });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest not found.");
    }));
    it("should return 400 if contest has already started", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
            role: "admin",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "admin@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue({
            startTime: new Date("2020-01-01T10:00:00.000Z"),
            endTime: new Date("2020-01-01T12:00:00.000Z"),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/contest/contest123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Contest",
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest has already started.");
    }));
});
describe("DELETE /api/contest/:contestId", () => {
    it("should delete contest successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
            role: "admin",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "admin@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue({
            deleteOne: jest.fn().mockResolvedValue(true),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/contest/contest123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Contest deleted successfully.");
    }));
    it("should return 404 if contest is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "admin@gmail.com",
            role: "admin",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "admin@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/contest/contest123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest not found.");
    }));
});
describe("POST /api/contest/:contestId/register", () => {
    it("should register user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        const contest = {
            status: "Upcoming",
            participants: [],
            save: jest.fn().mockResolvedValue(true),
        };
        contest_model_1.contestModel.findById.mockResolvedValue(contest);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest/contest123/register")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Registered successfully.");
    }));
    it("should return 404 if contest is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest/contest123/register")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest not found.");
    }));
    it("should return 400 if contest has ended", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue({
            status: "Ended",
            participants: [],
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest/contest123/register")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest has already ended.");
    }));
    it("should return 400 if user is already registered", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue({
            status: "Upcoming",
            participants: ["user123"],
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/contest/contest123/register")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You are already registered for this contest.");
    }));
});
describe("DELETE /api/contest/:contestId/unregister", () => {
    it("should unregister successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue({
            participants: ["user123", "user456"],
            save: jest.fn().mockResolvedValue(true),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/contest/contest123/unregister")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Unregistered successfully.");
    }));
    it("should return 404 if contest is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        contest_model_1.contestModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/contest/contest123/unregister")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Contest not found.");
    }));
});
describe("GET /api/contest/my/registered", () => {
    it("should return all registered contests", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
                email: "user@gmail.com",
            }),
        });
        contest_model_1.contestModel.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue([
                    {
                        title: "Weekly Contest 1",
                    },
                    {
                        title: "Weekly Contest 2",
                    },
                ]),
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/contest/my/registered")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.contests).toBeDefined();
        expect(res.body.contests.length).toBe(2);
    }));
});
