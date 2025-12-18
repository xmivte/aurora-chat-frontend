import { Chat } from '../types/index';
import { Message } from '../types/index';

export type ChatWindowProps = {
  curretUserId: string;
  chatRoom: Chat;
};

export type HeaderProps = {
  curretUserId: string;
  chatRoom: Chat;
};

export type MessageProps = {
  curretUserId: string;
  messages: Message[];
};
