import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user.model";
import { submissionModel } from "../models/submission.model";
import { authRequest } from "../types/authRequest.type";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No User found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Users",
      data: {
        users
      }
    });

  } catch (err) {
    next(err);
  }
}

export const getByUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(404).json({
        success: false,
        message: "Wrong route"
      })
    }

    const user = await userModel.findOne({ username: username }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "User Details",
      user
    });


  } catch (err) {
    next(err);
  }
}

export const getAllSubmission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.params.username;

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const submissions = await submissionModel
      .find({ userId: user._id })
      .populate("questionId")
      .sort({ createdAt: -1 })
      .lean();

    if (submissions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Submission found",
        submissions: []
      })
    }

    return res.status(200).json({
      success: true,
      message: "All Submissions",
      submissions
    })

  } catch (err) {
    next(err);
  }
}

export const getUserProfile = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

export const editProfile = async (req: authRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!req.user) {
      return res.status(400).json({
        message: "Can not find Error",
        success: false
      });
    }

    if (name) req.user.name = name;

    if (req.file) req.user.profilePic = req.file.filename;

    await req.user?.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated"
    })

  } catch (error) {
    next(error);
  }
}

export const deleteUser = async (req: authRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an admin user"
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: authRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role is required (user or admin)"
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};