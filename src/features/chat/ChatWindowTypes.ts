import { Chat } from './index';
import { Message } from './index';

export type ApiPinnedMessage = {
  id: number;
  messageId: number;
  groupId: string;
  pinnedBy: string;
  pinnedAt: string;
};

export type PinnedMessage = {
  message: Message;
  pinnedAt: Date;
};

export type ChatWindowProps = {
  currentUserId: string;
  chatRoom: Chat;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onChatCreated: (newChatId: string) => void;
};

export type HeaderProps = {
  chatRoom: Chat;
  pinnedMessages: PinnedMessage[];
  onDiscardPin?: (messageId: number) => void;
  onOpenPinnedMenu?: () => void;
};

export type UsernameImageMap = {
  username: string;
  image: string;
};

export type MessageProps = {
  currentUserId: string;
  messages: Message[];
  onPinMessage?: (message: Message) => void;
  canPin?: boolean;
  imageUrls: UsernameImageMap[];
};
