import { FileAttachment } from '../files/types/file';

export type Message = {
  id: number;
  user: User;
  content: string;
  date: Date;
  fk_chatId: string;
  fileAttachments?: FileAttachment[];
};

export type User = {
  id: string;
  username: string;
  image?: string | null;
};

export type Chat = {
  id: string;
  name?: string | null;
  image?: string | null;
  displayName?: string | null;
  displayImage?: string | null;
  isDraft?: boolean;
  users: User[];
};

export type ChatMessage = {
  id: number;
  senderId: string;
  groupId: string;
  content: string;
  createdAt: string;
  username: string;
  userImage?: string | null;
  fileAttachments?: FileAttachment[];
};
