import apiClient from '@/api';
import { AuthResponse, InitDataDto } from './types';
import { InitData } from '@telegram-apps/sdk-react';
import { adaptInitData } from './adapter';

export const authenticate = async (data: InitData): Promise<AuthResponse> => {
  const adaptedData: InitDataDto = adaptInitData(data);
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login/telegram', adaptedData);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message === "Пользователь с таким ID не существует") {
      return register(adaptedData);
    }
    throw error;
  }
};

const register = async (data: InitDataDto): Promise<AuthResponse> => {
  // TODO: Fix data mapping for api (requires user id with string value)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = data;
  if (
    payload?.user?.id
  ) payload.user.id = payload.user?.id.toString();
  const response = await apiClient.post<AuthResponse>('/auth/register/telegram', data);
  return response.data;
};