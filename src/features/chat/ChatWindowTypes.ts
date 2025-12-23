import { Chat } from './index';
import { Message } from './index';

export type ChatWindowProps = {
  currentUserId: string;
  chatRoom: Chat;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
};

export type HeaderProps = {
  currentUserId: string;
  chatRoom: Chat;
};

export type MessageProps = {
  currentUserId: string;
  messages: Message[];
};
