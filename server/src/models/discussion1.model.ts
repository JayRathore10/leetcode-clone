import mongoose, { Document, Types } from "mongoose";

export const CATEGORIES = [
  "General",
  "Problem",
  "Interview",
  "Contest",
  "Learning",
  "Career",
] as const;

export type DiscussionCategory = (typeof CATEGORIES)[number];

export interface DiscussionInterface extends Document {
  _id: Types.ObjectId;

  title: string;
  content: string;

  author: Types.ObjectId;

  category: DiscussionCategory;
  tags: string[];

  likes: Types.ObjectId[];
  bookmarks: Types.ObjectId[];

  views: number;
  replyCount: number;

  pinned: boolean;
  locked: boolean;

  reported: boolean;
  reportedBy: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

const discussionSchema = new mongoose.Schema<DiscussionInterface>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Category is required"],
      default: "General",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 5,
        message: "Maximum 5 tags allowed",
      },
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    locked: {
      type: Boolean,
      default: false,
    },

    reported: {
      type: Boolean,
      default: false,
    },

    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ pinned: -1, createdAt: -1 });
discussionSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

export const discussionModel = mongoose.model<DiscussionInterface>(
  "Discussion",
  discussionSchema
);