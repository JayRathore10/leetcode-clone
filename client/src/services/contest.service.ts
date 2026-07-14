import axios from "axios";
import { env } from "../configs/env.config";

const CONTEST_API = `${env.backendUrl}/api/contest`;

export const contestService = {
  getAllContests: async () => {
    const response = await axios.get(CONTEST_API, {
      withCredentials: true,
    });
    return response.data;
  },

  getContestById: async (id: string) => {
    const response = await axios.get(`${CONTEST_API}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  getMyRegisteredContests: async () => {
    const response = await axios.get(`${CONTEST_API}/my/registered`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  registerForContest: async (id: string) => {
    const response = await axios.post(`${CONTEST_API}/${id}/register`, {}, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  unregisterFromContest: async (id: string) => {
    const response = await axios.delete(`${CONTEST_API}/${id}/unregister`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  getContestLeaderboard: async (id: string) => {
    const response = await axios.get(`${CONTEST_API}/${id}/leaderboard`, {
      withCredentials: true,
    });
    return response.data;
  },

  getContestResults: async (id: string) => {
    const response = await axios.get(`${CONTEST_API}/${id}/results`, {
      withCredentials: true,
    });
    return response.data;
  }
};
