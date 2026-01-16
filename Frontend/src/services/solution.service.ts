import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  SolutionDto,
  CreateSolutionRequest,
  VoteSolutionRequest,
  UpdateSolutionRequest
} from "../types/solution.types";

const create = async (data: CreateSolutionRequest) => {
  return await axiosClient.post<ApiResponse<SolutionDto>>("/solutions", data);
};

const accept = async (solutionId: string) => {
  return await axiosClient.post<ApiResponse<any>>(
    `/solutions/${solutionId}/accept`,
    {}
  );
};

const vote = async (data: VoteSolutionRequest) => {
  return await axiosClient.post<ApiResponse<{ voteCount: number }>>(
    "/solutions/vote",
    data
  );
};

const getById = async (id: string) => {
  return await axiosClient.get<ApiResponse<SolutionDto>>(`/solutions/${id}`);
};

const getMySolutions = async () => {
  return await axiosClient.get<ApiResponse<SolutionDto[]>>("/solutions/my-solutions");
}

const getUserSolutions = async (userId: string) => {
  return await axiosClient.get<ApiResponse<SolutionDto[]>>(`/solutions/user/${userId}`);
}

const update = async (id: string, data: UpdateSolutionRequest) => {
  return await axiosClient.put<ApiResponse<SolutionDto>>(`/solutions/${id}`, data);
};

const remove = async (id: string) => {
  return await axiosClient.delete<ApiResponse<any>>(`/solutions/${id}`);
};

export const solutionService = {
  create,
  accept,
  vote,
  getById,
  getMySolutions,
  getUserSolutions,
  update,
  remove
};
