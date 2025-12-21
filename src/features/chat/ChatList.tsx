import Box from '@mui/material/Box';

import {
  chatListSx,
  ulSx,
  chatItemSx,
  chatButtonSx,
  avatarSx,
  nameRowSx,
  chatNameSx,
  unreadCountSx,
} from './ChatList';

import type { Chat } from './index';

type Props = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  unreadByGroup?: Record<string, number>;
};

export default function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
  unreadByGroup = {},
}: Props) {
  return (
    <Box sx={chatListSx}>
      <Box component="ul" sx={ulSx}>
        {chats.map(chat => {
          const chatKey = String(chat.id);
          const isSelected = selectedChatId !== null && chatKey === selectedChatId;

          const unread = unreadByGroup[chatKey] ?? 0;
          const isUnread = unread > 0;

          const displayName = chat.name && chat.name.trim().length > 0 ? chat.name : 'Chat';

          return (
            <Box key={chatKey} component="li" sx={chatItemSx(isSelected)}>
              <Box
                component="button"
                type="button"
                sx={chatButtonSx}
                onClick={() => onSelectChat(chatKey)}
              >
                <Box sx={avatarSx}>
                  {chat.image ? <img src={chat.image} alt={displayName} /> : null}
                </Box>

                <Box sx={nameRowSx}>
                  <Box component="span" sx={chatNameSx(isUnread)}>
                    {displayName}
                  </Box>

                  {isUnread ? (
                    <Box component="span" sx={unreadCountSx} aria-label="unread-count">
                      {unread > 99 ? '99+' : unread}
                    </Box>
                  ) : null}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
