import apiClient from './index';
import { Statistics } from './types';

export const getUserStatistics = async (): Promise<Statistics> => {
  const response = await apiClient.get<Statistics>('/users/me/statistics');
  return response.data;
};