import { Request, Response, NextFunction } from "express";
import { contestModel } from "../models/contest.model";
import { authRequest } from "../types/authRequest.type";

const getContestStatus = (
  startTime: Date,
  endTime: Date
): "Upcoming" | "Running" | "Ended" => {
  const now = new Date();

  if (now < startTime) {
    return "Upcoming";
  }

  if (now <= endTime) {
    return "Running";
  }

  return "Ended";
};

export const createContest = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      isPublic,
      problems,
    } = req.body;

    const duration =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
      (1000 * 60);

    const status = getContestStatus(
      new Date(startTime),
      new Date(endTime)
    );

    const contest = await contestModel.create({
      title,
      description,
      startTime,
      endTime,
      duration,
      isPublic,
      createdBy: req.user!._id,
      problems,
      participants: [],
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Contest created successfully.",
      contest,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Contests
export const getAllContests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contests = await contestModel
      .find()
      .populate("createdBy", "name username profilePic")
      .sort({ startTime: -1 });

    const contestsWithStatus = contests.map((contest) => ({
      ...contest.toObject(),
      status: getContestStatus(
        contest.startTime,
        contest.endTime
      ),
    }));

    return res.status(200).json({
      success: true,
      contests: contestsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

// Get Contest By Id
export const getContestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contestId } = req.params;

    const contest = await contestModel
      .findById(contestId)
      .populate("createdBy", "name username profilePic")
      .populate("problems")
      .populate("participants", "name username profilePic");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    const contestWithStatus = {
      ...contest.toObject(),
      status: getContestStatus(
        contest.startTime,
        contest.endTime
      ),
    };

    return res.status(200).json({
      success: true,
      contest: contestWithStatus,
    });
    
  } catch (error) {
    next(error);
  }
};



// Update Contest
export const updateContest = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contestId } = req.params;

    const contest = await contestModel.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    if (contest.startTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Contest has already started.",
      });
    }

    Object.assign(contest, req.body);

    // Convert to Date because req.body contains strings
    contest.startTime = new Date(contest.startTime);
    contest.endTime = new Date(contest.endTime);

    contest.duration =
      (contest.endTime.getTime() - contest.startTime.getTime()) /
      (1000 * 60);

    const now = new Date();

    if (now < contest.startTime) {
      contest.status = "Upcoming";
    } else if (now >= contest.startTime && now <= contest.endTime) {
      contest.status = "Running";
    } else {
      contest.status = "Ended";
    }

    await contest.save();

    return res.status(200).json({
      success: true,
      message: "Contest updated successfully.",
      contest,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Contest
export const deleteContest = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contestId } = req.params;

    const contest = await contestModel.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    await contest.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Contest deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Register For Contest
export const registerContest = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contestId } = req.params;

    const contest = await contestModel.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    const now = new Date();

    if (now >= contest.startTime) {
      return res.status(400).json({
        success: false,
        message: "Registration is closed.",
      });
    }

    if (contest.participants.includes(req.user!._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this contest.",
      });
    }

    contest.participants.push(req.user!._id);

    await contest.save();

    return res.status(200).json({
      success: true,
      message: "Registered successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Unregister From Contest
export const unregisterContest = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contestId } = req.params;

    const contest = await contestModel.findById(contestId);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    contest.participants = contest.participants.filter(
      (id) => id.toString() !== req.user!._id.toString()
    );

    await contest.save();

    return res.status(200).json({
      success: true,
      message: "Unregistered successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Get My Registered Contests
export const getMyContests = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const contests = await contestModel
      .find({
        participants: req.user!._id,
      })
      .populate("createdBy", "name username")
      .sort({ startTime: -1 });

    return res.status(200).json({
      success: true,
      contests,
    });
  } catch (error) {
    next(error);
  }
};

