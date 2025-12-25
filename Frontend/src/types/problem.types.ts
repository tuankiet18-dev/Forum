export interface Problem {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  title: string;
  content: string;
  category?: string;
  difficulty?: string;
  tags: string[];
  viewCount: number;
  solutionCount: number;
  hasAcceptedSolution: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProblemDetail extends Problem {
  userReputation: number;
  solutions: Solution[];
}

export interface Solution {
  id: string;
  username: string;
  userAvatar?: string;
  content: string;
  isAccepted: boolean;
  voteCount: number;
  createdAt: string;
}

export interface ProblemFilter {
  category?: string;
  difficulty?: string;
  searchTerm?: string;
  tag?: string;
  hasAcceptedSolution?: boolean;
  sortBy?: string;
  isDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateProblemRequest {
  title: string;
  content: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}