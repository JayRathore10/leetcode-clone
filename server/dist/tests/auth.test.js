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
const user_model_1 = require("../models/user.model");
const app_1 = __importDefault(require("../app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
describe("POST /api/auth/login", () => {
    it("should login successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        // mocking the DB using the jest mock 
        user_model_1.userModel.findOne.mockResolvedValue({
            email: "test@gmail.com",
            password: "hashedPassword",
        });
        // mocking bcrypt.compare(passowrd , user.password) 
        bcrypt_1.default.compare.mockReturnValue(true);
        // mocking jwt token
        jsonwebtoken_1.default.sign.mockReturnValue("fake_token");
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/auth/login").
            send({
            email: "test@gmail.com",
            password: "123456"
        });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        // take out cookies from the header 
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain("token=fake_token");
    }));
    it("should return 404 if user is not found in database", () => __awaiter(void 0, void 0, void 0, function* () {
        // this null means user not found in our database 
        user_model_1.userModel.findOne.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/auth/login").
            send({
            email: "test@gmail.com",
            password: "12345"
        });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    }));
    it("should return 400 if user password is not matching", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue({
            email: "test@gmail.com",
            password: "12345"
        });
        bcrypt_1.default.compare.mockReturnValue(false);
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/auth/login").
            send({
            email: "test@gmail.com",
            password: "123456"
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    }));
});
describe("POST /api/auth/register", () => {
    it("should register new user successfully with the status code of 201", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue(null);
        bcrypt_1.default.genSalt.mockResolvedValue("***");
        bcrypt_1.default.hash.mockResolvedValue("12345***");
        user_model_1.userModel.create.mockResolvedValue({
            username: "testUser",
            email: "test@gmail.com",
            password: "12345***",
            name: "test"
        });
        jsonwebtoken_1.default.sign.mockReturnValue("fake_token");
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/auth/register")
            .send({
            username: "testUser",
            email: "test@gmail.com",
            password: "12345***",
            name: "test"
        });
        expect(res.body.message).toBe("User Registered Successfully");
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    }));
    it("should return 400 when there is a zod parsed error", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue(null);
        bcrypt_1.default.genSalt.mockResolvedValue("***");
        bcrypt_1.default.hash.mockResolvedValue("12345***");
        user_model_1.userModel.create.mockResolvedValue({
            username: "testUser",
            email: "test@gmail",
            password: "12345***",
            name: "test"
        });
        jsonwebtoken_1.default.sign.mockReturnValue("fake_token");
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/auth/register")
            .send({
            username: "testUser",
            email: "test@gmail",
            password: "12345***",
            name: "test"
        });
        expect(res.body.message).toBe("parsed error");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    }));
    it("should return 400 when there is a user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        user_model_1.userModel.findOne.mockResolvedValue({
            username: "testUser11",
            email: "test@gmail.com",
            password: "123457***",
            name: "test 1"
        });
        const res = yield (0, supertest_1.default)(app_1.default).
            post("/api/auth/register")
            .send({
            username: "testUser",
            email: "test@gmail.com",
            password: "12345***",
            name: "test"
        });
        expect(res.body.message).toBe("User Already Exists");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    }));
});
describe("POST /api/auth/logout", () => {
    it("should logout user successfully and clear cookie", () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({ email: "test@gmail.com" });
        user_model_1.userModel.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                email: "test@gmail.com",
                username: "testUser"
            })
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/auth/logout").
            set("Cookie", "token=fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Log out successfully");
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain("token=");
    }));
});
describe("GET /api/auth/me", () => {
    it("should return 401 if no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/auth/me");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("No Token");
    }));
    it("should return 401 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        // mock jwt
        jsonwebtoken_1.default.verify.mockReturnValue({ userId: "123" });
        // mock mongoose chain
        user_model_1.userModel.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/auth/me")
            .set("Authorization", "Bearer fake_token");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("User not found");
    }));
    it("should return user details if token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        // mock jwt
        jsonwebtoken_1.default.verify.mockReturnValue({ userId: "123" });
        // mock mongoose chain
        user_model_1.userModel.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: "123",
                email: "test@gmail.com",
                username: "testUser"
            })
        });
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/auth/me")
            .set("Authorization", "Bearer fake_token");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe("test@gmail.com");
    }));
});
