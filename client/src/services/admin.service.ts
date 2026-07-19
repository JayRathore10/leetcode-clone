import axios from "axios";
import { env } from "../configs/env.config";
import { AdminStats, SubmissionsResponse } from "../configs/admin.types";

const ADMIN_API = `${env.backendUrl}/api/admin`;
const QUESTION_API = `${env.backendUrl}/api/question`;
const CONTEST_API = `${env.backendUrl}/api/contest`;
const USER_API = `${env.backendUrl}/api/users`;

const getConfig = () => ({
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const adminService = {
  // Stats
  getStats: async (): Promise<{ success: boolean; stats: AdminStats }> => {
    const response = await axios.get(`${ADMIN_API}/stats`, getConfig());
    return response.data;
  },

  // Problems
  createQuestion: async (data: any) => {
    const response = await axios.post(`${QUESTION_API}/add`, data, getConfig());
    return response.data;
  },
  updateQuestion: async (id: string, data: any) => {
    const response = await axios.put(`${QUESTION_API}/update/${id}`, data, getConfig());
    return response.data;
  },
  deleteQuestion: async (id: string) => {
    const response = await axios.delete(`${QUESTION_API}/delete/${id}`, getConfig());
    return response.data;
  },

  // Contests
  createContest: async (data: any) => {
    const response = await axios.post(`${CONTEST_API}`, data, getConfig());
    return response.data;
  },
  updateContest: async (id: string, data: any) => {
    const response = await axios.put(`${CONTEST_API}/${id}`, data, getConfig());
    return response.data;
  },
  deleteContest: async (id: string) => {
    const response = await axios.delete(`${CONTEST_API}/${id}`, getConfig());
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await axios.get(`${USER_API}/all`, getConfig());
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await axios.delete(`${USER_API}/${id}`, getConfig());
    return response.data;
  },
  updateUserRole: async (id: string, role: "user" | "admin") => {
    const response = await axios.put(`${USER_API}/${id}/role`, { role }, getConfig());
    return response.data;
  },

  // Submissions
  getSubmissions: async (page = 1, limit = 20, status = "All", language = "All", search = ""): Promise<SubmissionsResponse> => {
    const response = await axios.get(`${ADMIN_API}/submissions`, {
      ...getConfig(),
      params: { page, limit, status, language, search },
    });
    return response.data;
  },
  getSubmissionDetail: async (id: string) => {
    const response = await axios.get(`${env.backendUrl}/api/submission/${id}`, getConfig());
    return response.data;
  },

  // Discussions
  getAllDiscussions: async (page = 1, limit = 20) => {
    const response = await axios.get(`${env.backendUrl}/api/discussion/`, {
      ...getConfig(),
      params: { page, limit }
    });
    return response.data;
  },

  // Reported Discussions
  getReportedDiscussions: async () => {
    const response = await axios.get(`${ADMIN_API}/reported-discussions`, getConfig());
    return response.data;
  },
  togglePinDiscussion: async (id: string) => {
    const response = await axios.put(`${ADMIN_API}/discussions/${id}/pin`, {}, getConfig());
    return response.data;
  },
  toggleLockDiscussion: async (id: string) => {
    const response = await axios.put(`${ADMIN_API}/discussions/${id}/lock`, {}, getConfig());
    return response.data;
  },
  deleteDiscussion: async (id: string) => {
    const response = await axios.delete(`${ADMIN_API}/discussions/${id}`, getConfig());
    return response.data;
  },
  resolveDiscussionReport: async (id: string) => {
    const response = await axios.put(`${ADMIN_API}/discussions/${id}/resolve`, {}, getConfig());
    return response.data;
  },

  // Reported Replies
  getReportedReplies: async () => {
    const response = await axios.get(`${ADMIN_API}/reported-replies`, getConfig());
    return response.data;
  },
  deleteReply: async (id: string) => {
    const response = await axios.delete(`${ADMIN_API}/replies/${id}`, getConfig());
    return response.data;
  },
  resolveReplyReport: async (id: string) => {
    const response = await axios.put(`${ADMIN_API}/replies/${id}/resolve`, {}, getConfig());
    return response.data;
  },
};
