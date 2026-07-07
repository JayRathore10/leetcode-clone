import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface IReply {
  discussion: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  parentReply: Types.ObjectId | null;
  edited: boolean;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReplyVirtuals {
  likeCount: number;
}

type ReplyDocument = HydratedDocument<IReply, IReplyVirtuals>;

const replySchema = new Schema<IReply, {}, {}, IReplyVirtuals>(
  {
    discussion: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
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
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    // null = top-level reply; ObjectId = nested reply
    parentReply: {
      type: Schema.Types.ObjectId,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────
replySchema.index({ discussion: 1, createdAt: 1 });
replySchema.index({ parentReply: 1 });

// ── Virtuals ──────────────────────────────────────────────
replySchema.virtual("likeCount").get(function (this: ReplyDocument) {
  return this.likes.length;
});

const Reply = model<IReply>("Reply", replySchema);

export default Reply;