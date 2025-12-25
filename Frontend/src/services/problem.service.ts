// src/services/problem.service.ts
import axiosClient from "./axiosClient"; // <-- QUAN TRỌNG: Dùng cái này thay vì axios thường
import type {
  Problem,
  ProblemDetail,
  ProblemFilter,
  PaginatedResult,
  CreateProblemRequest,
} from "../types/problem.types";
import type { ApiResponse } from "../types/auth.types";

// Helper để tạo query string từ filter object
const getQueryParams = (filter: ProblemFilter) => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "All"
    ) {
      params.append(key, value.toString());
    }
  });
  return params;
};

export const problemService = {
  // Lấy danh sách (Home)
  getAll: async (filter: ProblemFilter): Promise<PaginatedResult<Problem>> => {
    const params = getQueryParams(filter);
    // axiosClient đã có baseURL, nên chỉ cần gọi endpoint tương đối
    const response = await axiosClient.get<
      ApiResponse<PaginatedResult<Problem>>
    >(`/problems?${params.toString()}`);
    return response.data.data!;
  },

  // Lấy chi tiết
  getById: async (id: string): Promise<ProblemDetail> => {
    const response = await axiosClient.get<ApiResponse<ProblemDetail>>(
      `/problems/${id}`
    );
    return response.data.data!;
  },

  // Tạo mới (axiosClient tự gắn token từ localStorage vào header)
  create: async (data: CreateProblemRequest) => {
    const response = await axiosClient.post<ApiResponse<Problem>>(
      "/problems",
      data
    );
    return response.data.data;
  },

  // Cập nhật
  update: async (id: string, data: Partial<CreateProblemRequest>) => {
    const response = await axiosClient.put<ApiResponse<Problem>>(
      `/problems/${id}`,
      data
    );
    return response.data.data;
  },

  // Xóa
  delete: async (id: string) => {
    await axiosClient.delete(`/problems/${id}`);
  },

  // Lấy bài toán của user hiện tại
  getMyProblems: async (): Promise<Problem[]> => {
    const response = await axiosClient.get<ApiResponse<Problem[]>>(
      "/problems/my-problems"
    );
    return response.data.data!;
  },
};
