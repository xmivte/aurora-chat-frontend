import { createContext } from 'react';

type NotificationsContextValue = {
  unreadByGroup: Record<string, number>;
  totalUnread: number;
  markGroupRead: (groupId: string) => Promise<void>;
  playSendSound: () => void;
};

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export type { NotificationsContextValue };
