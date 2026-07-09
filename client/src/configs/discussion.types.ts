export type DiscussionCategory =
  | "General"
  | "Problem"
  | "Interview"
  | "Contest"
  | "Learning"
  | "Career";

export const CATEGORIES: DiscussionCategory[] = [
  "General",
  "Problem",
  "Interview",
  "Contest",
  "Learning",
  "Career",
];

export interface Author {
  _id: string;
  username: string;
  name: string;
  profilePic: string;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: Author;
  category: DiscussionCategory;
  tags: string[];
  likes: string[];
  bookmarks: string[];
  views: number;
  replyCount: number;
  pinned: boolean;
  locked: boolean;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  discussion: string;
  author: Author;
  content: string;
  likes: string[];
  parentReply: string | null;
  edited: boolean;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionListResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalDiscussions: number;
  discussions: Discussion[];
}

export interface DiscussionDetailResponse {
  success: boolean;
  discussion: Discussion;
}

export interface RepliesResponse {
  success: boolean;
  totalReplies: number;
  replies: Reply[];
}

export interface SearchResponse {
  success: boolean;
  total: number;
  discussions: Discussion[];
}
