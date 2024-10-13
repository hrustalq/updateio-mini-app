import apiClient from './index';
import { Notification, PaginatedResponse } from './types';

export const getNotifications = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Notification>> => {
  const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', { params: { page, limit } });
  return response.data;
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await apiClient.patch(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};