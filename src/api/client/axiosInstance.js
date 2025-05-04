// /api/client/axiosInstance.js
import { accessTokenAtom } from '@/store/authAtom';
import axios from 'axios';
import { getDefaultStore } from 'jotai';

// Initialize Jotai store for synchronous reads
const jotaiStore = getDefaultStore();

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
  || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,                    // sends your HttpOnly cookie
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: attach access token from Jotai
axiosInstance.interceptors.request.use(config => {
  const token = jotaiStore.get(accessTokenAtom);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Interceptor: auto-refresh on 401
let isRefreshing = false;
let queue = [];

function processQueue(error, newToken = null) {
  queue.forEach(promise => {
    if (error) promise.reject(error);
    else      promise.resolve(newToken);
  });
  queue = [];
}

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    const originalReq = err.config;
    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(token => {
          originalReq.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalReq);
        });
      }

      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axiosInstance.post('/auth/refresh-token');
          const newToken = data.accessToken;

          // Write new token back into Jotai store
          jotaiStore.set(accessTokenAtom, newToken);

          processQueue(null, newToken);
          originalReq.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axiosInstance(originalReq));
        } catch (e) {
          processQueue(e, null);
          reject(e);
        } finally {
          isRefreshing = false;
        }
      });
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
