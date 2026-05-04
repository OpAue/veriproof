import axios from 'axios';

// 모든 API 요청에 공통으로 사용할 axios 인스턴스
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: localStorage의 토큰을 Authorization 헤더에 자동 삽입
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
