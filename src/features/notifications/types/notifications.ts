export type NotificationEventType = 'MESSAGE_CREATED' | 'GROUP_READ';

export type NotificationEventDTO = {
  type: NotificationEventType;

  groupId: string;
  fromUserId?: string | null;

  messageId?: number;
  content?: string | null;

  timestamp?: string;
  unreadCount?: number;
};
