export interface ContestUser {
  _id: string;
  name: string;
  username: string;
  profilePic?: string;
}

export interface ContestProblem {
  _id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  isPublic: boolean;
  createdBy: ContestUser | string;
  problems: ContestProblem[] | string[];
  participants: ContestUser[] | string[];
  status: "Upcoming" | "Running" | "Ended";
  createdAt: string;
  updatedAt: string;
}
