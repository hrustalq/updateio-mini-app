import apiClient from './index';
import { Game, Subscription, PaginatedResponse, CreateSubscriptionDto } from './types';

export const getGames = async (
  appId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Game>> => {
  const response = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: { appId, page, limit }
  });
  return response.data;
};

export const searchGames = async (
  appId: string,
  name: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Game>> => {
  const response = await apiClient.get<PaginatedResponse<Game>>('/games/search', {
    params: { appId, name, page, limit }
  });
  return response.data;
};

export const getGame = async (gameId: number): Promise<Game> => {
  const response = await apiClient.get<Game>(`/games/${gameId}`);
  return response.data;
};

export const subscribeToGame = async (gameId: number): Promise<Subscription> => {
  const response = await apiClient.post<Subscription>(`/games/${gameId}/subscribe`);
  return response.data;
};

export const unsubscribeFromGame = async (id: string): Promise<void> => {
  await apiClient.delete(`/subscriptions/${id}`);
};

export const getUserSubscriptions = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Subscription>> => {
  const response = await apiClient.get<PaginatedResponse<Subscription>>('/subscriptions', { params: { page, limit } });
  return response.data;
};

// Добавьте эту функцию в конец файла
export const createSubscription = async (data: CreateSubscriptionDto): Promise<Subscription> => {
  const response = await apiClient.post<Subscription>('/subscriptions', data);
  return response.data;
};