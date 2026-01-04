import { Chat } from '../index.ts';

export const getChatDisplayName = (chat: Chat, currentUserId: string) => {

  if (!chat.users || chat.users.length === 0) { return chat.name || "Uknown"; }

  if (chat.users.length === 2) {
    const other = chat.users.find(u => u.id != currentUserId);
    return other?.username ?? "Uknown";
  }
  return chat.name || "Uknown";
}

export const getChatDisplayImage = (chat: Chat, currentUserId: string) => {

  if (!chat.users || chat.users.length === 0) { return chat.image || ""; }

  if (chat.users.length === 2) {
    const other = chat.users.find(u => u.id != currentUserId);
    return other?.image ?? "";
  }
  return chat.image || "";
}