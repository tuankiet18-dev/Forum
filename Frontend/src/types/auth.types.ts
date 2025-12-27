// src/types/auth.types.ts

// Cấu trúc chung của Response từ Backend (Wrapper)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Token DTO
export interface TokenDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

// User Info DTO
export interface AuthResponseDto {
  userId: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  reputation: number;
  roles: string[];
  tokens: TokenDto;
}

// Request Body cho Login
export interface LoginRequest {
  username: string;
  password?: string;
}

// Request Body cho Register
export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  reputation: number;
  createdAt: string;
}

export interface ProfileEditRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}