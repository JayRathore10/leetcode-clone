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
const user_model_1 = require("../models/user.model");
const reply_model_1 = require("../models/reply.model");
const discussion_model_1 = require("../models/discussion.model");
jest.mock("../models/user.model");
jest.mock("../models/reply.model");
jest.mock("../models/discussion.model");
jest.mock("jsonwebtoken");
describe("POST /api/reply", () => {
    it("should create reply successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        discussion_model_1.discussionModel.findById.mockResolvedValue({
            locked: false,
            replyCount: 0,
            save: jest.fn().mockResolvedValue(true),
        });
        reply_model_1.replyModel.create.mockResolvedValue({
            _id: "reply123",
            content: "Nice problem!",
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply")
            .set("Cookie", "token=fake_token")
            .send({
            discussionId: "discussion123",
            content: "Nice problem!",
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Reply added successfully");
    }));
    it("should return 400 if discussionId or content is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply")
            .set("Cookie", "token=fake_token")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion Id and content are required");
    }));
    it("should return 404 if discussion is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        discussion_model_1.discussionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply")
            .set("Cookie", "token=fake_token")
            .send({
            discussionId: "discussion123",
            content: "Hello",
        });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
    it("should return 400 if discussion is locked", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        discussion_model_1.discussionModel.findById.mockResolvedValue({
            locked: true,
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply")
            .set("Cookie", "token=fake_token")
            .send({
            discussionId: "discussion123",
            content: "Hello",
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("This discussion is locked");
    }));
    it("should return 404 if parent reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        discussion_model_1.discussionModel.findById.mockResolvedValue({
            locked: false,
        });
        reply_model_1.replyModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply")
            .set("Cookie", "token=fake_token")
            .send({
            discussionId: "discussion123",
            content: "Hello",
            parentReply: "reply1",
        });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Parent reply not found");
    }));
});
describe("GET /api/reply/discussion/:discussionId", () => {
    it("should return replies", () => __awaiter(void 0, void 0, void 0, function* () {
        reply_model_1.replyModel.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue([
                    {
                        content: "First Reply",
                    },
                    {
                        content: "Second Reply",
                    },
                ]),
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/reply/discussion/discussion123");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.totalReplies).toBe(2);
        expect(res.body.replies.length).toBe(2);
    }));
});
describe("PUT /api/reply/:replyId", () => {
    it("should update reply successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const reply = {
            author: {
                toString: () => "user123",
            },
            content: "Old",
            edited: false,
            save: jest.fn().mockResolvedValue(true),
        };
        reply_model_1.replyModel.findById.mockResolvedValue(reply);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/reply/reply123")
            .set("Cookie", "token=fake_token")
            .send({
            content: "Updated Reply",
        });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Reply updated successfully");
    }));
});
describe("PUT /api/reply/:replyId", () => {
    it("should return 400 if content is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/reply/reply123")
            .set("Cookie", "token=fake_token")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Content is required");
    }));
    it("should return 404 if reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        reply_model_1.replyModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/reply/reply123")
            .set("Cookie", "token=fake_token")
            .send({
            content: "Updated",
        });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Reply not found");
    }));
    it("should return 403 if user is not owner", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        reply_model_1.replyModel.findById.mockResolvedValue({
            author: {
                toString: () => "anotherUser",
            },
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/reply/reply123")
            .set("Cookie", "token=fake_token")
            .send({
            content: "Updated",
        });
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You are not authorized to update this reply");
    }));
});
describe("DELETE /api/reply/:replyId", () => {
    it("should delete reply successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        reply_model_1.replyModel.findById.mockResolvedValue({
            author: {
                toString: () => "user123",
            },
            discussion: "discussion123",
            deleteOne: jest.fn().mockResolvedValue(true),
        });
        discussion_model_1.discussionModel.findByIdAndUpdate.mockResolvedValue({});
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/reply/reply123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Reply deleted successfully");
    }));
    it("should return 404 if reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        reply_model_1.replyModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/reply/reply123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Reply not found");
    }));
    it("should return 403 if user is not owner", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        reply_model_1.replyModel.findById.mockResolvedValue({
            author: {
                toString: () => "anotherUser",
            },
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/reply/reply123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You are not authorized to delete this reply");
    }));
});
describe("POST /api/reply/:replyId/like", () => {
    it("should like reply successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const reply = {
            likes: [],
            save: jest.fn().mockResolvedValue(true),
        };
        reply_model_1.replyModel.findById.mockResolvedValue(reply);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply/reply123/like")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Reply liked");
        expect(res.body.likes).toBe(1);
    }));
    it("should unlike reply successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const reply = {
            likes: [
                {
                    toString: () => "user123",
                },
            ],
            save: jest.fn().mockResolvedValue(true),
        };
        reply_model_1.replyModel.findById.mockResolvedValue(reply);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply/reply123/like")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Reply unliked");
        expect(res.body.likes).toBe(0);
    }));
    it("should return 404 if reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        reply_model_1.replyModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply/reply123/like")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Reply not found");
    }));
});
describe("POST /api/reply/:replyId/report", () => {
    it("should report reply successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const reply = {
            reported: false,
            save: jest.fn().mockResolvedValue(true),
        };
        reply_model_1.replyModel.findById.mockResolvedValue(reply);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply/reply123/report")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Reply reported successfully");
    }));
    it("should return 400 if reply has already been reported", () => __awaiter(void 0, void 0, void 0, function* () {
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
        reply_model_1.replyModel.findById.mockResolvedValue({
            reported: true,
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply/reply123/report")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Reply has already been reported");
    }));
    it("should return 404 if reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
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
        reply_model_1.replyModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/reply/reply123/report")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Reply not found");
    }));
});
