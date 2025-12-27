import axiosClient from "./axiosClient"
import type { ApiResponse, AuthResponseDto, ChangePasswordRequest, LoginRequest, ProfileEditRequest, RegisterRequest, TokenDto, UserProfile } from "../types/auth.types"

const saveTokens = (tokens: TokenDto) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("refreshToken", tokens.refreshToken)
  }
}

const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }
}

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

const login = async (data: LoginRequest): Promise<ApiResponse<AuthResponseDto>> => {
  try {
    const response = await axiosClient.post<ApiResponse<AuthResponseDto>>("/auth/login", data)
    const result = response.data

    if (result.success && result.data) {
      saveTokens(result.data.tokens)
    }
    return result
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Connection error" }
  }
}

const register = async (data: RegisterRequest): Promise<ApiResponse<AuthResponseDto>> => {
  try {
    const response = await axiosClient.post<ApiResponse<AuthResponseDto>>("/auth/register", data)
    const result = response.data

    if (result.success && result.data) {
      saveTokens(result.data.tokens)
    }
    return result
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Connection error" }
  }
}

const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await axiosClient.get<ApiResponse<UserProfile>>("/auth/me");
  return response.data.data!;
}

const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file); // Key "file" phải trùng với tên biến trong UploadAvatarDto (C#)

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
  return await axiosClient.post<ApiResponse<any>>("/auth/change-password", data);
};

export const authService = {
  saveTokens,
  logout,
  getToken,
  login,
  register,
  getCurrentUser,
  uploadAvatar,
  updateProfile,
  changePassword,
}
