import Box from '@mui/material/Box';

import avatar from '../../assets/firstUser.svg';

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

          const displayName =
            chat.displayName && chat.displayName.trim().length > 0 ? chat.displayName : 'Chat';

          return (
            <Box key={chatKey} component="li" sx={chatItemSx(isSelected)}>
              <Box
                component="button"
                type="button"
                sx={chatButtonSx}
                onClick={() => onSelectChat(chatKey)}
              >
                <Box sx={avatarSx}>
                  {chat.displayImage && chat.displayImage.trim() !== '' ? (
                    <img src={chat.displayImage} alt={displayName || 'avatar'} />
                  ) : (
                    <img src={avatar} alt="avatar" />
                  )}
                </Box>

                <Box sx={nameRowSx}>
                  <Box component="span" sx={chatNameSx(isUnread)}>
                    {displayName}
                    {chat.isDraft && <i> (Draft)</i>}
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
