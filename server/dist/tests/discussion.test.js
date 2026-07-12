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
const discussion1_model_1 = require("../models/discussion1.model");
const user_model_1 = require("../models/user.model");
jest.mock("../models/discussion.model");
jest.mock("../models/user.model");
jest.mock("jsonwebtoken");
describe("POST /api/discussion", () => {
    it("should create discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        discussion1_model_1.discussionModel.create.mockResolvedValue({
            title: "Binary Search",
            content: "How to solve binary search efficiently?",
            category: "Problem",
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Binary Search",
            content: "How to solve binary search efficiently?",
            category: "Problem",
            tags: ["binary-search", "dsa"],
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion created successfully");
    }));
    it("should return 400 if required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion")
            .set("Cookie", "token=fake_token")
            .send({
            title: "",
            content: "",
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Title, content and category are required");
    }));
    it("should return 401 if token is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion")
            .send({
            title: "Binary Search",
            content: "Content",
            category: "Problem",
        });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Token not Found");
    }));
    it("should return 401 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Binary Search",
            content: "Content",
            category: "Problem",
        });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
    }));
});
describe("GET /api/discussion", () => {
    it("should return all discussions", () => __awaiter(void 0, void 0, void 0, function* () {
        const limit = jest.fn().mockResolvedValue([
            {
                title: "Discussion 1",
            },
            {
                title: "Discussion 2",
            },
        ]);
        const skip = jest.fn().mockReturnValue({
            limit,
        });
        const sort = jest.fn().mockReturnValue({
            skip,
        });
        const populate = jest.fn().mockReturnValue({
            sort,
        });
        discussion1_model_1.discussionModel.find.mockReturnValue({
            populate,
        });
        discussion1_model_1.discussionModel.countDocuments.mockResolvedValue(2);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/discussion");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.discussions).toBeDefined();
        expect(res.body.discussions.length).toBe(2);
        expect(res.body.totalDiscussions).toBe(2);
    }));
});
describe("GET /api/discussion/:discussionId", () => {
    it("should return discussion by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const populate = jest.fn().mockResolvedValue({
            _id: "discussion123",
            title: "Binary Search",
        });
        discussion1_model_1.discussionModel.findByIdAndUpdate.mockReturnValue({
            populate,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/discussion/discussion123");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.discussion.title).toBe("Binary Search");
    }));
    it("should return 404 if discussion is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const populate = jest.fn().mockResolvedValue(null);
        discussion1_model_1.discussionModel.findByIdAndUpdate.mockReturnValue({
            populate,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/discussion/discussion123");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
});
describe("PUT /api/discussion/:discussionId", () => {
    it("should update discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const discussion = {
            _id: "discussion123",
            title: "Old Title",
            content: "Old Content",
            category: "Problem",
            tags: ["old"],
            author: {
                toString: () => "user123",
            },
            locked: false,
            save: jest.fn().mockResolvedValue(true),
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Title",
            content: "Updated Content",
            category: "Contest",
            tags: ["contest"],
        });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion updated successfully");
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
        discussion1_model_1.discussionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Title",
        });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
    it("should return 403 if user is not the author", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        discussion1_model_1.discussionModel.findById.mockResolvedValue({
            author: {
                toString: () => "anotherUser",
            },
            locked: false,
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Title",
        });
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You are not authorized to edit this discussion");
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
        discussion1_model_1.discussionModel.findById.mockResolvedValue({
            author: {
                toString: () => "user123",
            },
            locked: true,
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token")
            .send({
            title: "Updated Title",
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("This discussion is locked");
    }));
});
describe("DELETE /api/discussion/:discussionId", () => {
    it("should delete discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        discussion1_model_1.discussionModel.findById.mockResolvedValue({
            author: {
                toString: () => "user123",
            },
            deleteOne: jest.fn().mockResolvedValue(true),
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion deleted successfully");
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
        discussion1_model_1.discussionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
    it("should return 403 if user is not the author", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        discussion1_model_1.discussionModel.findById.mockResolvedValue({
            author: {
                toString: () => "anotherUser",
            },
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/discussion/discussion123")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You are not authorized to delete this discussion");
    }));
});
describe("POST /api/discussion/:discussionId/like", () => {
    it("should like discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const discussion = {
            likes: [],
            save: jest.fn().mockResolvedValue(true),
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/like")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion liked");
        expect(res.body.likes).toBe(1);
    }));
    it("should unlike discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const discussion = {
            likes: [
                {
                    toString: () => "user123",
                },
            ],
            save: jest.fn().mockResolvedValue(true),
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/like")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion unliked");
        expect(res.body.likes).toBe(0);
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
        discussion1_model_1.discussionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/like")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
});
describe("POST /api/discussion/:discussionId/bookmark", () => {
    it("should bookmark discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const discussion = {
            bookmarks: [],
            save: jest.fn().mockResolvedValue(true),
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/bookmark")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion bookmarked");
        expect(res.body.bookmarks).toBe(1);
    }));
    it("should remove bookmark successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const discussion = {
            bookmarks: [
                {
                    toString: () => "user123",
                },
            ],
            save: jest.fn().mockResolvedValue(true),
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/bookmark")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Bookmark removed");
        expect(res.body.bookmarks).toBe(0);
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
        discussion1_model_1.discussionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/bookmark")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
});
describe("POST /api/discussion/:discussionId/report", () => {
    it("should report discussion successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const discussion = {
            reported: false,
            reportedBy: [],
            save: jest.fn().mockResolvedValue(true),
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/report")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Discussion reported successfully");
    }));
    it("should return 400 if discussion is already reported by user", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({
            email: "user@gmail.com",
            role: "user",
        });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "user123",
            }),
        });
        const discussion = {
            reportedBy: [
                {
                    toString: () => "user123",
                },
            ],
        };
        discussion1_model_1.discussionModel.findById.mockResolvedValue(discussion);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/report")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("You have already reported this discussion");
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
        discussion1_model_1.discussionModel.findById.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/discussion/discussion123/report")
            .set("Cookie", "token=fake_token");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Discussion not found");
    }));
});
describe("GET /api/discussion/search", () => {
    it("should return searched discussions", () => __awaiter(void 0, void 0, void 0, function* () {
        const sort = jest.fn().mockResolvedValue([
            {
                title: "Binary Search",
            },
        ]);
        const populate = jest.fn().mockReturnValue({
            sort,
        });
        discussion1_model_1.discussionModel.find.mockReturnValue({
            populate,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/discussion/search?q=binary");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.total).toBe(1);
        expect(res.body.discussions.length).toBe(1);
    }));
    it("should return 400 if search query is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/discussion/search");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Search query is required");
    }));
});
