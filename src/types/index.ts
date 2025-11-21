export type Message = {
  id: number;
  user: User;
  content: string;
  date: Date;
  fk_chatId: number;
};

export type User = {
  id: number;
  name: string;
  image?: string | null;
};

export type Chat = {
  id: number;
  name?: string | null;
  image?: string | null;
  unread?: boolean;
  users: User[];
};
