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
exports.getSubmissionDetail = exports.userAllSubmission = exports.addSubmission = void 0;
const submission_validation_1 = require("../validation/submission.validation");
const submission_model_1 = require("../models/submission.model");
const addSubmission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
        const parsed = submission_validation_1.submissionSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: parsed.error.format()
            });
        }
        const { questionId, code, language, status, title } = parsed.data;
        const newSubmission = yield submission_model_1.submissionModel.create({
            userId,
            questionId,
            code,
            language,
            status,
            title
        });
        if (!newSubmission) {
            return res.status(400).json({
                success: false,
                message: "Error in creating Submission"
            });
        }
        return res.status(201).json({
            success: true,
            message: "New Submission Created",
            submission: newSubmission
        });
    }
    catch (err) {
        next(err);
    }
});
exports.addSubmission = addSubmission;
const userAllSubmission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString();
        const userSubmissions = yield submission_model_1.submissionModel.
            find({ userId }).
            populate("questionId").
            sort({ createdAt: -1 }).
            lean();
        if (userSubmissions.length === 0) {
            /**
             * if there is no submission no issue user is new to the app
             */
            return res.status(200).json({
                success: false,
                message: "User don't have any submissions"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User's All Submissions",
            submissions: userSubmissions
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userAllSubmission = userAllSubmission;
const getSubmissionDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submissionId = req.params.id;
        const submission = yield submission_model_1.submissionModel.findOne({ _id: submissionId }).populate("questionId");
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }
        return res.status(200).json({
            success: true,
            messaage: "Submission",
            submission
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSubmissionDetail = getSubmissionDetail;
