import { Chat } from '../features/chat/index';
import { Message } from '../features/chat/index';

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
