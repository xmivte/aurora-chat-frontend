export type Message = {
  id: number;
  user: User;
  content: string;
  date: Date;
  fk_chatId: number;
};

export type User = {
  id: string;
  name: string;
  image?: string | null;
};

export type Chat = {
  id: number;
  name?: string | null;
  image?: string | null;
  users: User[];
};

export type ChatMessage = {
  groupId: number;
  content: string;
  createdAt: string;
  id: number;
  senderId: string;
  username: string;
};
