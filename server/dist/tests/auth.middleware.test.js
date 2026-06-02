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
const auth_middleware_1 = require("../middleware/auth.middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
jest.mock("jsonwebtoken");
jest.mock("../models/user.model");
describe("Auth Middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });
    describe("isUserLoggedIn", () => {
        it("should return 401 if no token", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, auth_middleware_1.isUserLoggedIn)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Token not Found"
            });
        }));
        it("should call next with the error if jwt fails", () => __awaiter(void 0, void 0, void 0, function* () {
            req.cookies.token = "fakeToken";
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });
            yield (0, auth_middleware_1.isUserLoggedIn)(req, res, next);
            expect(next).toHaveBeenCalled();
        }));
        it("should return 401 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
            req.cookies.token = "validToken";
            jsonwebtoken_1.default.verify.mockReturnValue({
                email: "test@test.com"
            });
            user_model_1.userModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });
            yield (0, auth_middleware_1.isUserLoggedIn)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        }));
        it("should call next and attach user if valid", () => __awaiter(void 0, void 0, void 0, function* () {
            req.cookies.token = "ValidToken";
            jsonwebtoken_1.default.verify.mockReturnValue({
                email: "test@test.com"
            });
            const mockUser = { email: "test@test.com" };
            user_model_1.userModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });
            yield (0, auth_middleware_1.isUserLoggedIn)(req, res, next);
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        }));
    });
    describe("isAdminLoggedIn", () => {
        it("should return 403 if not admin", () => __awaiter(void 0, void 0, void 0, function* () {
            req.cookies.token = "validToken";
            jsonwebtoken_1.default.verify.mockReturnValue({
                email: "test@test.com",
                role: "user"
            });
            yield (0, auth_middleware_1.isAdminLoggedIn)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        }));
        it("should call next if admin", () => __awaiter(void 0, void 0, void 0, function* () {
            req.cookies.token = "ValidToken";
            jsonwebtoken_1.default.verify.mockReturnValue({
                email: "admin@test.com",
                role: "admin"
            });
            const mockUser = { email: "admin@test.com" };
            user_model_1.userModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });
            yield (0, auth_middleware_1.isAdminLoggedIn)(req, res, next);
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        }));
    });
});
