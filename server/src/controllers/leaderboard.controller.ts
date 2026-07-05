import { Request, Response, NextFunction } from "express";
import { submissionModel } from "../models/submission.model";

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaderboard = await submissionModel.aggregate([
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

  } catch (err) {
    next(err);
  }
}