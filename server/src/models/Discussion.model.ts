import { Schema, model, Types, HydratedDocument, Model } from "mongoose";

export const CATEGORIES = [
  "General",
  "Storage",
  "API",
  "Security",
  "Feature Request",
  "Bug Report",
] as const;

export type DiscussionCategory = (typeof CATEGORIES)[number];

export interface IDiscussion {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscussionVirtuals {
  likeCount: number;
  bookmarkCount: number;
}

export interface IDiscussionModel extends Model<IDiscussion> {
  CATEGORIES: readonly DiscussionCategory[];
}

type DiscussionDocument = HydratedDocument<
  IDiscussion,
  IDiscussionVirtuals
>;

const discussionSchema = new Schema<
  IDiscussion,
  IDiscussionModel,
  {},
  IDiscussionVirtuals
>(
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: "Invalid category",
      },
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
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    bookmarks: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
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
      index: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    reported: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});
discussionSchema.index({ pinned: -1, createdAt: -1 });

// ── Virtuals ─────────────────────────────────────────────
discussionSchema.virtual("likeCount").get(function (this: DiscussionDocument) {
  return this.likes.length;
});

discussionSchema
  .virtual("bookmarkCount")
  .get(function (this: DiscussionDocument) {
    return this.bookmarks.length;
  });

// ── Statics ──────────────────────────────────────────────
(discussionSchema.statics as any).CATEGORIES = CATEGORIES;

const Discussion = model<IDiscussion, IDiscussionModel>(
  "Discussion",
  discussionSchema
);

export default Discussion;