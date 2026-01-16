// src/utils/token.utils.ts
import Cookies from 'js-cookie';
import type { TokenDto } from '../types/auth.types';

export const setTokens = (tokens: TokenDto) => {
  // Lưu AccessToken vào LocalStorage (hoặc biến memory nếu muốn bảo mật hơn)
  localStorage.setItem('accessToken', tokens.accessToken);
  
  // Lưu RefreshToken vào Cookie
  // expires: 7 ngày (tùy chỉnh theo logic BE của bạn)
  Cookies.set('refreshToken', tokens.refreshToken, { expires: 7, secure: false, sameSite: 'Strict' });
};

export const getAccessToken = () => localStorage.getItem('accessToken');

export const getRefreshToken = () => Cookies.get('refreshToken');   

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  Cookies.remove('refreshToken');
};