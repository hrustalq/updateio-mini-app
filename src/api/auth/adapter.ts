import { Chat, InitData, User } from '@telegram-apps/sdk-react';
import { InitDataDto, WebAppUser, WebAppChat } from './types';

export function adaptInitData(data: InitData): InitDataDto {
  const initData: InitData = data['initData']

  const adaptedData: InitDataDto = {
    query_id: initData.queryId,
    auth_date: new Date(initData.authDate), // Convert UNIX timestamp to Date
    hash: initData.hash,
  };

  if (initData.user) {
    adaptedData.user = adaptUser(initData.user);
  }

  if (initData.receiver) {
    adaptedData.receiver = adaptUser(initData.receiver);
  }

  if (initData.chat) {
    adaptedData.chat = adaptChat(initData.chat);
  }

  if (initData.chatType) {
    adaptedData.chat_type = initData.chatType;
  }

  if (initData.chatInstance) {
    adaptedData.chat_instance = initData.chatInstance;
  }

  if (initData.startParam) {
    adaptedData.start_param = initData.startParam;
  }

  if (initData.canSendAfter) {
    adaptedData.can_send_after = initData.canSendAfter;
  }

  return adaptedData;
}

function adaptUser(user: User): WebAppUser {
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    username: user.username,
    language_code: user.languageCode,
    is_premium: user.isPremium,
    added_to_attachment_menu: user.addedToAttachmentMenu,
    allows_write_to_pm: user.allowsWriteToPm,
    photo_url: user.photoUrl,
  };
}

function adaptChat(chat: Chat): WebAppChat {
  return {
    id: chat.id,
    type: chat.type,
    title: chat.title,
    username: chat.username,
    photo_url: chat.photoUrl,
  };
}