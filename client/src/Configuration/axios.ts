import axios from 'axios';

export const API_URI = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

const isDev = import.meta.env.DEV;

const logRequest = (config: any) => {
  if (isDev) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || config.params || '');
  }
  return config;
};

const logResponse = (response: any) => {
  if (isDev) {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
  }
  return response;
};

const logError = (error: any) => {
  if (isDev) {
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
  }
  return Promise.reject(error);
};

/** Singleton Axios instance pre-configured with the backend base URL. */
const httpClient = axios.create({
  baseURL: API_URI,
});

httpClient.interceptors.request.use(logRequest, logError);
httpClient.interceptors.response.use(logResponse, logError);

export default httpClient;
