"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeRouter = void 0;
const express_1 = require("express");
const analyze_controller_1 = require("../controllers/analyze.controller");
exports.analyzeRouter = (0, express_1.Router)();
exports.analyzeRouter.post("/", analyze_controller_1.analyzeCode);
