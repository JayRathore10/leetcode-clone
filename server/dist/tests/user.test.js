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
const user_model_1 = require("../models/user.model");
const app_1 = __importDefault(require("../app"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const supertest_1 = __importDefault(require("supertest"));
const submission_model_1 = require("../models/submission.model");
jest.mock("../models/user.model");
jest.mock("../middleware/auth.middleware", () => ({
    isUserLoggedIn: jest.fn()
}));
jest.mock("../models/submission.model");
describe("GET /api/users/test", () => {
    it("should return 200 for success run", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/test");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Hello");
    }));
});
describe("GET /api/users/all", () => {
    it("should return 404 when there is no user in database", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.find.mockResolvedValue([]);
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/all");
        expect(res.status).toBe(404);
    }));
    it("should return 200 when successfully return all users in database", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.find.mockResolvedValue(["user"]);
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/all");
        expect(res.status).toBe(200);
    }));
});
describe("GET /api/users/profile", () => {
    it("should return 400 when Error in getting user details", () => __awaiter(void 0, void 0, void 0, function* () {
        auth_middleware_1.isUserLoggedIn.mockImplementation((req, res, next) => {
            req.user = null;
            next();
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/profile");
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Error in getting user detail");
    }));
    it("should return 404 when the user is not found in database", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });
        auth_middleware_1.isUserLoggedIn.mockImplementation((req, res, next) => {
            req.user = { _id: "123" };
            next();
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/profile");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");
    }));
    it("should return 200 when user data exists", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "1243",
            })
        });
        auth_middleware_1.isUserLoggedIn.mockImplementation((req, res, next) => {
            req.user = { _id: "1234" };
            next();
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/profile");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User Data");
        expect(res.body.user).toBeDefined();
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
            json: jest.fn()
        };
        mockNext = jest.fn();
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("should return 400 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockReq = {
            body: { name: "John" },
            user: undefined
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Can not find Error",
            success: false
        });
    }));
    it("should update user name", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const saveMock = jest.fn().mockResolvedValue(true);
        mockReq = {
            body: { name: "John" },
            user: {
                name: "Old",
                profilePic: "old.png",
                save: saveMock
            }
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect((_a = mockReq.user) === null || _a === void 0 ? void 0 : _a.name).toBe("John");
        expect(saveMock).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            message: "Profile Updated"
        });
    }));
    it("should update profile picture", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const saveMock = jest.fn().mockResolvedValue(true);
        mockReq = {
            body: {},
            file: {
                filename: "newpic.png"
            },
            user: {
                name: "Old",
                profilePic: "old.png",
                save: saveMock
            }
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect((_a = mockReq.user) === null || _a === void 0 ? void 0 : _a.profilePic).toBe("newpic.png");
        expect(saveMock).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
    }));
    it("should update both name and profile pic", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const saveMock = jest.fn().mockResolvedValue(true);
        mockReq = {
            body: { name: "John" },
            file: {
                filename: "newpic.png"
            },
            user: {
                name: "Old",
                profilePic: "old.png",
                save: saveMock
            }
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect((_a = mockReq.user) === null || _a === void 0 ? void 0 : _a.name).toBe("John");
        expect((_b = mockReq.user) === null || _b === void 0 ? void 0 : _b.profilePic).toBe("newpic.png");
        expect(saveMock).toHaveBeenCalled();
    }));
    it("should call next on error", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("DB Error");
        const saveMock = jest.fn().mockRejectedValue(error);
        mockReq = {
            body: { name: "John" },
            user: {
                name: "Old",
                save: saveMock
            }
        };
        yield (0, user_controller_1.editProfile)(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(error);
    }));
});
describe("GET /api/users/:username", () => {
    it("should return 404 when user not exits in database ", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/testUser");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "User not found"
        });
    }));
    it("should return 200 when user exists in database and return successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "1234"
            })
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/testUser");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "User Details",
            user: {
                _id: "1234"
            }
        });
    }));
});
describe("GET /api/users/:username/all-submission", () => {
    it("should return 404 when user not exits in database", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/testUser/all-submissions");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "User not found"
        });
    }));
    it("should return 200 when the successfully find the submissions and return then", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue({
            _id: "1234"
        });
        submission_model_1.submissionModel.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue([
                { _id: "sub1", createdAt: "2024-01-01" },
                { _id: "sub2", createdAt: "2024-01-02" }
            ])
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            get("/api/users/testUser/all-submissions");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "All Submissions",
            data: {
                submissions: [
                    { _id: "sub1", createdAt: "2024-01-01" },
                    { _id: "sub2", createdAt: "2024-01-02" }
                ]
            }
        });
    }));
});
