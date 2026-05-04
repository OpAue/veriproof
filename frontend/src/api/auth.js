import axiosInstance from './axiosInstance';

// 회원가입 API
export const signup = (data) => axiosInstance.post('/auth/signup', data);

// 로그인 API → 서버에서 { token, user } 반환
export const login = (data) => axiosInstance.post('/auth/login', data);
