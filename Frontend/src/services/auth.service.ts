import axiosClient from "./axiosClient"
import type { ApiResponse, AuthResponseDto, LoginRequest, RegisterRequest, TokenDto } from "../types/auth.types"

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

export const authService = {
  saveTokens,
  logout,
  getToken,
  login,
  register,
}
