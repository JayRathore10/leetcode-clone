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
exports.isAdminLoggedIn = exports.isUserLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../configs/env.config");
const user_model_1 = require("../models/user.model");
const isUserLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not Found"
            });
        }
        const decodeData = jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
        const user = yield user_model_1.userModel.findOne({
            email: decodeData.email
        }).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isUserLoggedIn = isUserLoggedIn;
const isAdminLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not Found"
            });
        }
        const decodeData = jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
        if (decodeData.role != "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not admin"
            });
        }
        const user = yield user_model_1.userModel.findOne({
            email: decodeData.email
        }).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not found"
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isAdminLoggedIn = isAdminLoggedIn;
