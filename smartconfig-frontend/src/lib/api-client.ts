import axios, { AxiosInstance } from 'axios';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` }),
  },
});

export default apiClient;
