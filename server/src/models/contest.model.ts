import mongoose, { Document, Types } from "mongoose";

export interface ContestInterface extends Document {
  _id: Types.ObjectId;

  title: string;
  description: string;

  startTime: Date;
  endTime: Date;

  duration: number;

  isPublic: boolean;

  createdBy: Types.ObjectId;

  problems: Types.ObjectId[];

  participants: Types.ObjectId[];

  status: "Upcoming" | "Running" | "Ended";

  createdAt?: Date;
  updatedAt?: Date;
}

const contestSchema = new mongoose.Schema<ContestInterface>(
  {
    title: {
      type: String,
      required: [true, "Contest title is required"],
      trim: true,
      minLength: 3,
      maxLength: 100,
    },

    description: {
      type: String,
      required: [true, "Contest description is required"],
      trim: true,
      maxLength: 1000,
    },

    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },

    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["Upcoming", "Running", "Ended"],
      default: "Upcoming",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const contestModel = mongoose.model<ContestInterface>(
  "Contest",
  contestSchema
);