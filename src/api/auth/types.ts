import { User } from "@telegram-apps/sdk-react";

export interface WebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface WebAppChat {
  id: number;
  type: string;
  title: string;
  username?: string;
  photo_url?: string;
}

export interface InitDataDto {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  chat?: WebAppChat;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: Date;
  hash: string;
}

// Предполагаемая структура ответа аутентификации
export interface AuthResponse {
  // Добавьте здесь поля, которые возвращает ваш API при успешной аутентификации
  // Например:
  token: string;
  user: User;
}
