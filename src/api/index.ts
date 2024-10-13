import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) throw new Error('API_URL is not defined');

// Создаем экземпляр axios с базовой конфигурацией
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
    Accept: "application/json",
  },
  withCredentials: true,
});
// // Добавляем перехватчик запросов для обработки ошибок или добавления токенов
// apiClient.interceptors.request.use(
//   (config) => {
//     // Здесь можно добавить логику для добавления токенов аутентификации
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Добавляем перехватчик ответов для обработки ошибок
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Здесь можно добавить логику для обработки ошибок (например, перенаправление на страницу входа при 401 ошибке)
//     return Promise.reject(error);
//   }
// );

export * from './auth';
export * from './games';
export * from './statistics';
export * from './profile';
export * from './settings';
export * from './notifications';

export default apiClient;