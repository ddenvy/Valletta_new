import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_VERSION = 'v1';

// Добавим логирование для отладки
console.log('Axios: Initializing with base URL:', API_BASE_URL);

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Создаем экземпляр axios с базовым URL и версией API
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с HTTP-only cookies
});

// Добавляем перехватчик запросов
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Получаем токен из localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_data') : null;
    
    // Если токен есть, добавляем его в заголовки
    if (token) {
      try {
        const { token: accessToken } = JSON.parse(token);
        config.headers.Authorization = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик ответов
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    if (!error.config) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    
    // Если ошибка 401 и мы еще не пытались обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        await axiosInstance.post('/auth/refresh');
        
        // Повторяем исходный запрос
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен, перенаправляем на страницу входа
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_data');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Обрабатываем ошибки rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
      
      // Можно добавить логику для повторного запроса после указанного времени
    }
    
    return Promise.reject(error);
  }
);

// Экспортируем экземпляр axios
export default axiosInstance;

// Экспортируем функцию для создания экземпляра axios с другой версией API
export function createApiClient(version: string = API_VERSION): AxiosInstance {
  return axios.create({
    baseURL: `${API_BASE_URL}/api/${version}`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}
