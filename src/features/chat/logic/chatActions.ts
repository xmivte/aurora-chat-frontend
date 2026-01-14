import { QueryClient } from '@tanstack/react-query';

import { Chat, User } from '../index';

export function handleUserSelect({
  user,
  chatRooms,
  setSelectedChatId,
  setTempChat,
  closeDialog,
}: {
  user: User;
  chatRooms: Chat[] | undefined;
  setSelectedChatId: (id: string) => void;
  setTempChat: (chat: Chat | null) => void;
  closeDialog: () => void;
}) {
  const rooms = chatRooms ?? [];

  const existingChat = rooms.find(
    chat => chat.users?.length === 2 && chat.users.some(u => u.id === user.id)
  );

  if (existingChat) {
    setSelectedChatId(existingChat.id);
    setTempChat(null);
    closeDialog();
    return;
  }

  const draft = {
    id: 'draft-' + user.id,
    isDraft: true,
    displayName: user.username,
    displayImage: user.image || '',
    users: [user],
  };

  setTempChat(draft);
  setSelectedChatId(draft.id);
  closeDialog();
}

export function handleChatCreated({
  newId,
  userId,
  tempChat,
  queryClient,
  setTempChat,
  setSelectedChatId,
}: {
  newId: string;
  userId: string | null;
  tempChat: Chat | null;
  queryClient: QueryClient;
  setTempChat: (chat: Chat | null) => void;
  setSelectedChatId: (id: string) => void;
}) {
  queryClient.setQueryData(['chatRooms', userId], (oldChats: Chat[] | undefined) => {
    if (!oldChats) return oldChats;

    const newChat: Chat = {
      id: newId,
      name: 'GroupChat',
      users: tempChat?.users ?? [],
      displayName: tempChat?.displayName ?? 'Group Chat',
      displayImage: tempChat?.displayImage ?? '',
      isDraft: false,
    };

    return [...oldChats.filter(c => !c.isDraft), newChat];
  });

  setTempChat(null);
  setSelectedChatId(newId);
}
