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
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let error = Object.assign({}, err);
        error.message = err.message;
        console.error(err);
        // Mongoose bad objectId 
        if (err.name === "CastError") {
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }
        // Mongoose duplicate key 
        if (err.code === 11000) {
            const message = "Duplicate field value entered";
            error = new Error(message);
            error.statusCode = 400;
        }
        // Mongoose validation error 
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((val) => val.message).join(",");
            error = new Error(message);
            error.statusCode = 400;
        }
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
});
exports.errorMiddleware = errorMiddleware;
