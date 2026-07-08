import mongoose, { Document, Types } from "mongoose";

export interface ReplyInterface extends Document {
  _id: Types.ObjectId;

  discussion: Types.ObjectId;
  author: Types.ObjectId;

  content: string;

  likes: Types.ObjectId[];

  // null = reply to discussion
  // ObjectId = reply to another reply
  parentReply: Types.ObjectId | null;

  edited: boolean;
  reported: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const replySchema = new mongoose.Schema<ReplyInterface>(
  {
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: [true, "Reply content is required"],
      trim: true,
      minlength: [2, "Reply must be at least 2 characters"],
      maxlength: [2000, "Reply cannot exceed 2000 characters"],
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    parentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
      index: true,
    },

    edited: {
      type: Boolean,
      default: false,
    },

    reported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
replySchema.index({ discussion: 1, createdAt: 1 });
replySchema.index({ parentReply: 1 });

export const replyModel = mongoose.model<ReplyInterface>(
  "Reply",
  replySchema
);

