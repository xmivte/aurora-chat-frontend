import { Chat } from '../types/index';
import { Message } from '../types/index';

export type ChatWindowProps = {
  curretUserId: number;
  chatRoom: Chat;
  messages: Message[];
};
