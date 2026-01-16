import axiosClient from "./axiosClient";
import type {
  ApiResponse,
  AuthResponseDto,
  ChangePasswordRequest,
  LoginRequest,
  ProfileEditRequest,
  RegisterRequest,
  UserProfile,
} from "../types/auth.types";
import { setTokens, clearTokens, getAccessToken } from "../utils/token.utils";

const login = async (
  data: LoginRequest
): Promise<ApiResponse<AuthResponseDto>> => {
  try {
    const response = await axiosClient.post<ApiResponse<AuthResponseDto>>(
      "/auth/login",
      data
    );
    const result = response.data;

    if (result.success && result.data) {
      setTokens(result.data.tokens);
    }
    return result;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Connection error" }
    );
  }
};

const register = async (
  data: RegisterRequest
): Promise<ApiResponse<AuthResponseDto>> => {
  try {
    const response = await axiosClient.post<ApiResponse<AuthResponseDto>>(
      "/auth/register",
      data
    );
    const result = response.data;

    if (result.success && result.data) {
      setTokens(result.data.tokens);
    }
    return result;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Connection error" }
    );
  }
};

// Hàm Logout: Gọi API để hủy token trên server, sau đó xóa ở client
const logout = async () => {
  try {
    // Gọi API logout (cần AccessToken, axiosClient sẽ tự gắn vào header)
    await axiosClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout API call failed", error);
  } finally {
    // Luôn xóa token ở client dù API thành công hay thất bại
    clearTokens();
    // Có thể reload trang hoặc redirect nếu cần thiết
    // window.location.href = '/login'; 
  }
};

const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await axiosClient.get<ApiResponse<UserProfile>>("/auth/me");
  return response.data.data!;
};

const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post<ApiResponse<string>>(
    "/auth/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data!;
};

const updateProfile = async (data: ProfileEditRequest) => {
  return await axiosClient.put<ApiResponse<any>>("/auth/edit-profile", data);
};

const changePassword = async (data: ChangePasswordRequest) => {
  return await axiosClient.post<ApiResponse<any>>(
    "/auth/change-password",
    data
  );
};

const getProfile = async (id: string) => {
  return await axiosClient.get<ApiResponse<UserProfile>>(`auth/profile/${id}`);
};

// SỬA LẠI PHẦN EXPORT CHO ĐÚNG
export const authService = {
  login,            // Map đúng hàm login
  register,         // Map đúng hàm register
  logout,           // Thêm hàm logout
  getCurrentUser,
  uploadAvatar,
  updateProfile,
  changePassword,
  getProfile,
  getToken: getAccessToken, // Helper để lấy token nếu cần
};