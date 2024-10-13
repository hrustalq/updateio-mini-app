import { apiClient } from '.';
import { App } from './types';

export const getApps = async (page = 1, limit = 20) => {
  return apiClient.get<{ data: App[], meta: { page: number, totalPages: number } }>('/apps', {
    params: { page, limit }
  }).then(response => response.data);
};

export const searchApps = async (query: string, page = 1, limit = 20) => {
  return apiClient.get<{ data: App[], meta: { page: number, totalPages: number } }>('/apps/search', {
    params: { query, page, limit }
  }).then(response => response.data);
};
