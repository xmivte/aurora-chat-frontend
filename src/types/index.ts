export type Message = {
  id: number;
  user: User;
  content: string;
  date: Date;
};

export type User = {
  id: number;
  name: string;
  pictureUrl?: string;
};

export type Chat = {
  name?: string;
  pictureUrl: string;
  users: User[];
};
