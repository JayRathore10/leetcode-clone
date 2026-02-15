"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND = exports.GEMINI_API_KEY = exports.JWT_SECRET = exports.SALT_ROUND = exports.COOKIE_SECRET = exports.NODE_ENV = exports.MONGODB_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
_a = process.env, exports.MONGODB_URI = _a.MONGODB_URI, exports.NODE_ENV = _a.NODE_ENV, exports.COOKIE_SECRET = _a.COOKIE_SECRET, exports.SALT_ROUND = _a.SALT_ROUND, exports.JWT_SECRET = _a.JWT_SECRET, exports.GEMINI_API_KEY = _a.GEMINI_API_KEY, exports.FRONTEND = _a.FRONTEND;
