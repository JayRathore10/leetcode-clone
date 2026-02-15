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
exports.deleteTestCase = exports.addTestCase = exports.getHiddenTestCases = exports.getVisibleTestCase = void 0;
const testCase_model_1 = require("../models/testCase.model");
const testCase_validation_1 = __importDefault(require("../validation/testCase.validation"));
const getVisibleTestCase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.questionId;
        const testCases = yield testCase_model_1.testCaseModel.find({ questionId, isHidden: false });
        if (testCases.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Test Cases are not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "These are the test cases",
            testCases
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getVisibleTestCase = getVisibleTestCase;
const getHiddenTestCases = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.questionId;
        const testCases = yield testCase_model_1.testCaseModel.find({ questionId, isHidden: true });
        if (testCases.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No test Case found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "These are all hidden test cases",
            testCases
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getHiddenTestCases = getHiddenTestCases;
const addTestCase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = testCase_validation_1.default.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.format()
            });
        }
        ;
        const newTestCases = yield testCase_model_1.testCaseModel.insertMany(parsed.data);
        if (!newTestCases) {
            return res.status(400).json({
                success: false,
                message: "New Test case is not created"
            });
        }
        return res.status(201).json({
            success: true,
            message: "New Test Case Created",
            newTestCases
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addTestCase = addTestCase;
const deleteTestCase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testCaseId = req.params.testCaseId;
        const testCase = yield testCase_model_1.testCaseModel.findByIdAndDelete(testCaseId);
        if (!testCase) {
            return res.status(404).json({
                success: false,
                message: "Not Test Case found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "This test case deleted"
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteTestCase = deleteTestCase;
