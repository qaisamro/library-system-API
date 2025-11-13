// src/services/api.ts
import { Configuration, DefaultApi } from '../api-client';
import axios from 'axios';

// إعداد Axios Interceptor لإضافة التوكن تلقائيًا
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const createConfig = (): Configuration => {
  return new Configuration({
    basePath: 'http://localhost:5000/api/v1',
    apiKey: () => localStorage.getItem('token') || '',
    baseOptions: {
      headers: {
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      },
    },
  });
};

let apiClient = new DefaultApi(createConfig());

export const updateToken = (token: string) => {
  if (!token) {
    console.warn('تم تمرير توكن فارغ إلى updateToken');
    return;
  }
  localStorage.setItem('token', token);
  apiClient = new DefaultApi(createConfig());
};

export const api = () => apiClient;