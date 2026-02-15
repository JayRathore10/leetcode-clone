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
exports.me = exports.logoutUser = exports.loginUser = exports.registerNewUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_validation_1 = require("../validation/user.validation");
const env_config_1 = require("../configs/env.config");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = user_validation_1.userSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: parsed.error.format()
            });
        }
        const { username, email, password, name } = parsed.data;
        const isUserExist = yield user_model_1.userModel.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            });
        }
        const salt = yield bcrypt_1.default.genSalt(Number(env_config_1.SALT_ROUND));
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_model_1.userModel.create({
            username,
            email,
            password: hashedPassword,
            name
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Error in creating user"
            });
        }
        const token = jsonwebtoken_1.default.sign({ email }, env_config_1.JWT_SECRET);
        res.cookie("token", token);
        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user
        });
    }
    catch (err) {
        next(err);
    }
});
exports.registerNewUser = registerNewUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = user_validation_1.userLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: parsed.error.format()
            });
        }
        const { email, password } = parsed.data;
        const user = yield user_model_1.userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            });
        }
        let result = yield bcrypt_1.default.compare(password, user.password);
        if (result === false) {
            return res.status(400).json({
                success: false,
                message: "Password is invalid"
            });
        }
        const token = jsonwebtoken_1.default.sign({ email }, env_config_1.JWT_SECRET);
        res.cookie("token", token);
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // procted have to make middleware for it 
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Log out successfully"
        });
    }
    catch (err) {
        next(err);
    }
});
exports.logoutUser = logoutUser;
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "No Token"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
        const user = yield user_model_1.userModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.me = me;
