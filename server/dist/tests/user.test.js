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
const user_model_1 = require("../models/user.model");
const submission_model_1 = require("../models/submission.model");
const user_controller_1 = require("../controllers/user.controller");
jest.mock("../models/user.model");
jest.mock("../models/submission.model");
// Mock auth middleware
jest.mock("../middleware/auth.middleware", () => ({
    isUserLoggedIn: (req, res, next) => {
        req.user = {
            _id: "user123",
            name: "John",
            save: jest.fn(),
        };
        next();
    },
    isAdminLoggedIn: (req, res, next) => {
        req.user = {
            _id: "admin123",
            role: "admin",
        };
        next();
    },
}));
describe("GET /api/users/all", () => {
    afterEach(() => jest.clearAllMocks());
    it("should return 404 when no users exist", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/all");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "No User found",
        });
    }));
    it("should return all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = [{ _id: "1" }];
        user_model_1.userModel.find.mockResolvedValue(users);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/all");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "All Users",
            data: {
                users,
            },
        });
    }));
});
describe("GET /api/users/profile", () => {
    afterEach(() => jest.clearAllMocks());
    it("should return logged in user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/profile");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(res.body.user._id).toBe("user123");
    }));
});
describe("PUT /api/users/profile", () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });
    afterEach(() => jest.restoreAllMocks());
    it("should return 400 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockReq = {
            body: {},
            user: undefined,
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Can not find Error",
        });
    }));
    it("should update name", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const save = jest.fn().mockResolvedValue(true);
        mockReq = {
            body: { name: "Jay" },
            user: {
                name: "Old",
                profilePic: "old.png",
                save,
            },
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect((_a = mockReq.user) === null || _a === void 0 ? void 0 : _a.name).toBe("Jay");
        expect(save).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            message: "Profile Updated",
        });
    }));
    it("should update profile picture", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const save = jest.fn().mockResolvedValue(true);
        mockReq = {
            body: {},
            file: {
                filename: "new.png",
            },
            user: {
                name: "Old",
                profilePic: "old.png",
                save,
            },
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect((_a = mockReq.user) === null || _a === void 0 ? void 0 : _a.profilePic).toBe("new.png");
        expect(save).toHaveBeenCalled();
    }));
    it("should update both fields", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const save = jest.fn().mockResolvedValue(true);
        mockReq = {
            body: { name: "Jay" },
            file: {
                filename: "new.png",
            },
            user: {
                name: "Old",
                profilePic: "old.png",
                save,
            },
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect((_a = mockReq.user) === null || _a === void 0 ? void 0 : _a.name).toBe("Jay");
        expect((_b = mockReq.user) === null || _b === void 0 ? void 0 : _b.profilePic).toBe("new.png");
        expect(save).toHaveBeenCalled();
    }));
    it("should call next on error", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("DB Error");
        mockReq = {
            body: { name: "Jay" },
            user: {
                save: jest.fn().mockRejectedValue(error),
            },
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(error);
    }));
});
describe("GET /api/users/:username", () => {
    afterEach(() => jest.clearAllMocks());
    it("should return 404 when user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/test");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "User not found",
        });
    }));
    it("should return user details", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { _id: "1" };
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(user),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/test");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "User Details",
            user,
        });
    }));
});
describe("GET /api/users/:username/all-submissions", () => {
    afterEach(() => jest.clearAllMocks());
    it("should return 404 when user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/test/all-submissions");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "User not found",
        });
    }));
    it("should return no submissions", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue({
            _id: "123",
        });
        submission_model_1.submissionModel.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([]),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/test/all-submissions");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "No Submission found",
            submissions: [],
        });
    }));
    it("should return all submissions", () => __awaiter(void 0, void 0, void 0, function* () {
        const submissions = [
            { _id: "sub1" },
            { _id: "sub2" },
        ];
        user_model_1.userModel.findOne.mockResolvedValue({
            _id: "123",
        });
        submission_model_1.submissionModel.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(submissions),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/users/test/all-submissions");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "All Submissions",
            submissions,
        });
    }));
});
