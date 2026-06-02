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
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("../middleware/error.middleware");
describe("errorMiddleware", () => {
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
    });
    // 🔹 Default error (500)
    it("should return 500 for generic error", () => __awaiter(void 0, void 0, void 0, function* () {
        const err = new Error("Something went wrong");
        yield (0, error_middleware_1.errorMiddleware)(err, mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Something went wrong"
        });
    }));
    // 🔹 CastError (invalid ObjectId)
    it("should handle CastError and return 404", () => __awaiter(void 0, void 0, void 0, function* () {
        const err = {
            name: "CastError",
            message: "Invalid ID"
        };
        yield (0, error_middleware_1.errorMiddleware)(err, mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Resource not found"
        });
    }));
    // 🔹 Duplicate key error
    it("should handle duplicate key error (11000)", () => __awaiter(void 0, void 0, void 0, function* () {
        const err = {
            code: 11000,
            message: "Duplicate key"
        };
        yield (0, error_middleware_1.errorMiddleware)(err, mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Duplicate field value entered"
        });
    }));
    // 🔹 Validation error
    it("should handle validation error and return 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const err = {
            name: "ValidationError",
            errors: {
                email: { message: "Email is required" },
                password: { message: "Password too short" }
            }
        };
        yield (0, error_middleware_1.errorMiddleware)(err, mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Email is required,Password too short"
        });
    }));
    // 🔹 Catch block fallback
    it("should handle unexpected failure inside middleware", () => __awaiter(void 0, void 0, void 0, function* () {
        const err = null; // this will break err.message access
        yield (0, error_middleware_1.errorMiddleware)(err, mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: "Server Error"
        });
    }));
});
