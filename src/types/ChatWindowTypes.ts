import { Chat } from '../types/index';
import { Message } from '../types/index';

export type ChatWindowProps = {
  curretUserId: number;
  chatRoom: Chat;
  messages: Message[];
};

export type HeaderProps = {
  curretUserId: number;
  chatRoom: Chat;
};

export type MessageProps = {
  curretUserId: number;
  messages: Message[];
};
