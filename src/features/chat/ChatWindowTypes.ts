import { Chat } from './index';
import { Message } from './index';

export type ChatWindowProps = {
  currentUserId: number;
  chatRoom: Chat;
  messages: Message[];
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
};

export type HeaderProps = {
  currentUserId: number;
  chatRoom: Chat;
};

export type MessageProps = {
  currentUserId: number;
  messages: Message[];
};
