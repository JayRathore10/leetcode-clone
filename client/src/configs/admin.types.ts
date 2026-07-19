import { Discussion, Reply } from "./discussion.types";


export interface AdminStats {
  totalUsers: number;
  totalProblems: number;
  totalContests: number;
  totalSubmissions: number;
  totalDiscussions: number;
  acceptedSubmissions: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
  profilePic: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  constraints: string[];
  example: {
    input: string;
    output: string;
    explanation: string;
  };
  createdAt: string;
}

export interface Submission {
  _id: string;
  userId: User;
  questionId: {
    _id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
  };
  title: string;
  code: string;
  language: string;
  status: "Accepted" | "WA" | "TLE" | "MLE";
  createdAt: string;
}

export interface SubmissionsResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalSubmissions: number;
  submissions: Submission[];
}

export interface ReportedDiscussion extends Discussion {
  reportedBy: User[];
}

export interface ReportedReply extends Reply {
  discussion: any; // populated with title
}
