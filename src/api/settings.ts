import apiClient from './index';
import { Settings, UpdateSettingsDto } from './types';

export const getUserSettings = async (): Promise<Settings> => {
  const response = await apiClient.get<Settings>('/users/me/settings');
  return response.data;
};

export const updateUserSettings = async (settingsData: UpdateSettingsDto): Promise<Settings> => {
  const response = await apiClient.patch<Settings>('/users/me/settings', settingsData);
  return response.data;
};