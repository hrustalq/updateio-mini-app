import apiClient from './index';
import { User, UpdateProfileDto } from './types';

export const getUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};

export const updateUserProfile = async (profileData: UpdateProfileDto): Promise<User> => {
  const response = await apiClient.patch<User>('/users/me', profileData);
  return response.data;
};