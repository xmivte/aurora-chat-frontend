export type Message = {
  id: number;
  user: User;
  content: string;
  date: Date;
  fk_chatId: string;
};

export type User = {
  id: string;
  name: string;
  image?: string | null;
};

export type Chat = {
  id: string;
  name?: string | null;
  image?: string | null;
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
};
