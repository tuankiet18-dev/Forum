export interface SolutionDto {
  id: string;
  problemId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  userReputation: number;
  content: string;
  steps: string[]; // Thêm steps
  isAccepted: boolean;
  voteCount: number;
  commentCount: number; // Thêm commentCount
  currentUserVote?: number | null; // 1: upvote, -1: downvote, null: chưa vote
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSolutionRequest {
  problemId: string;
  content: string;
  steps?: string[]; // Thêm steps (optional)
}

export interface VoteSolutionRequest {
  solutionId: string;
  voteType: number; // 1 hoặc -1
}