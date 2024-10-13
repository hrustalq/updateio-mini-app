export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Game {
  id: string;
  name: string;
  image: string | null;
  appId: string;
  app: {
    name: string;
    image: string | null;
  }
  version: number | null;
}

export interface Subscription {
  id: string;
  isSubscribed: boolean;
  game: {
    id: string;
    name: string;
    image: string | null;
  }
  app: {
    id: string;
    name: string;
    image: string | null;
  }
}

export interface Statistics {
  totalSubscriptions: number;
  totalNotifications: number;
  lastLoginAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface Settings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  language: string;
  theme: 'light' | 'dark';
}

export interface UpdateSettingsDto {
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  language?: string;
  theme?: 'light' | 'dark';
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface App {
  id: string;
  name: string;
  image: string | null;
}

export interface CreateSubscriptionDto {
  gameId: string;
  appId: string;
  isSubscribed: boolean;
}

export interface UnsubscribeDto {
  subscriptionId: string;
}