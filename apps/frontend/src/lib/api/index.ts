import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration with automatic localhost detection and fallback
const getBaseURL = (): string => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development mode, try localhost first, fallback to production
  //if (import.meta.env.DEV) {
  //  return 'http://localhost:8787';
  //}
  
  // Production fallback
  return 'https://hdbank-backend-prod.4rqnf2gvxf.workers.dev';
};

// Fallback URL for when localhost is not available
const PRODUCTION_URL = 'https://hdbank-backend-prod.4rqnf2gvxf.workers.dev';
let currentBaseURL = getBaseURL();
let hasTriedFallback = false;

const API_CONFIG = {
  baseURL: currentBaseURL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
};

// Log the API base URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_CONFIG.baseURL);
  console.log('🔧 Environment variables:');
  console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('  - DEV mode:', import.meta.env.DEV);
  console.log('  - Current base URL:', currentBaseURL);
  console.log('  - Has tried fallback:', hasTriedFallback);
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: currentBaseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to switch to production fallback
const switchToProductionFallback = () => {
  if (!hasTriedFallback && import.meta.env.DEV && currentBaseURL.includes('localhost')) {
    hasTriedFallback = true;
    currentBaseURL = PRODUCTION_URL;
    apiClient.defaults.baseURL = PRODUCTION_URL;
    console.warn('🔄 Localhost backend not available, switching to production:', PRODUCTION_URL);
    return true;
  }
  return false;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (import.meta.env.DEV) {
      const endTime = new Date();
      const startTime = response.config.metadata?.startTime;
      if (startTime) {
        console.log(`API Call: ${response.config.url} - ${endTime.getTime() - startTime.getTime()}ms`);
      }
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    // Handle localhost connection errors - fallback to production
    if (!error.response && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
      if (switchToProductionFallback()) {
        // Retry the request with production URL
        return apiClient(originalRequest);
      }
    }
    
    // Retry logic for network errors
    if (!error.response && originalRequest._retryCount < API_CONFIG.retryAttempts) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return apiClient(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  // Generic methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),
};

// Extend axios config type to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
    _retry?: boolean;
    _retryCount?: number;
  }
}

export default apiClient;
