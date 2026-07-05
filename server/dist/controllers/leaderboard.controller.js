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
exports.getLeaderboard = void 0;
const submission_model_1 = require("../models/submission.model");
const getLeaderboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaderboard = yield submission_model_1.submissionModel.aggregate([
            {
                $match: {
                    status: "Accepted"
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        questionId: "$questionId"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.userId",
                    problemsSolved: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    problemsSolved: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    username: "$user.username",
                    profilePic: "$user.profilePic",
                    problemsSolved: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            leaderboard
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getLeaderboard = getLeaderboard;
