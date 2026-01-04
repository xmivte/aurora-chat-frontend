import Button from '@mui/material/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import type { Chat, User } from '@/features/chat';
import {
 // tempChatMessageStyles,
 // tempChatTitleStyles,
 // tempChatDescriptionStyles,
 // noChatSelectedStyles,
 // serverTabStyles,
  loadingUserStyles,
} from './App.styles';
import { LogoutButton } from './auth';
import './App.css';
import { api } from './auth/utils/api';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ChatList from './features/chat/ChatList.tsx';
import ChatWindow from './features/chat/ChatWindow.tsx';
import { NotificationsProvider } from './features/notifications/NotificationsProvider';
import { useNotifications } from './features/notifications/useNotifications';
import NewChatDialog from './features/search/NewChatDialog.tsx';
import SideBar, { type Server } from './features/server/SideBar';
import { getChatDisplayName, getChatDisplayImage } from './features/chat/helpers/getChatDisplayInfo.ts';
import { handleUserSelect, handleChatCreated } from './features/chat/logic/chatActions.ts';
import chatsData from './mock/chats.json';

const mockServers: Server[] = [
  { id: 'personal', label: 'Personal', glyph: 'P', bg: '#5553eb' },
  { id: 'a', label: 'Server A', glyph: 'A', bg: '#5553eb' },
  { id: 'b', label: 'Server B', glyph: 'B', bg: '#f5b400' },
  { id: 'c', label: 'DB Primary', glyph: 'DB', bg: '#0f766e' },
  { id: 'd', label: 'DB Replica', glyph: 'R', bg: '#1e293b' },
  { id: 'e', label: 'Cache', glyph: 'C', bg: '#2563eb' },
  { id: 'f', label: 'Worker 1', glyph: 'W1', bg: '#9333ea' },
];

const TEMP_CHAT_ID = '__temp_new_chat__';

const fetchChatRooms = async (userId: string): Promise<Chat[]> => {
  const res = await api.get<Chat[]>(`/group/${userId}`);
  return res.data;
};

const fetchUsers = async (groupId: string): Promise<User[]> => {
  const res = await api.get<User[]>(`/user/${groupId}`);
  return res.data;
};

const fetchAllUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>(`/user/all`);
  return res.data;
};

function AppInner({ userId }: { userId: string }) {
  const [activeId, setActiveId] = useState<string>('personal');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [tempChat, setTempChat] = useState<Chat | null>(null);

  const queryClient = useQueryClient();
  const { unreadByGroup } = useNotifications();

  const { data: chatRooms } = useQuery<Chat[]>({
    queryKey: ['chatRooms', userId],
    queryFn: async () => {
      const rooms = await fetchChatRooms(userId as string);
      return rooms.map(room => ({
        ...room,
        displayName: getChatDisplayName(room, userId as string),
        displayImage: getChatDisplayImage(room, userId as string),
      }));
    },
    enabled: !!userId,
  });

  const selectedChat = useMemo(() => {
    if (!chatRooms || !selectedChatId) return null;
    return chatRooms.find(chat => String(chat.id) === String(selectedChatId)) || null;
  }, [chatRooms, selectedChatId]);

  //const chatsForList = useMemo(() => {
   // const base = chatRooms ?? [];
   // return tempChat ? [...base, tempChat] : base;
 // }, [chatRooms, tempChat]);

  const { data: users } = useQuery<User[]>({
    queryKey: ['users', selectedChatId],
    queryFn: () => fetchUsers(selectedChatId as string),
    enabled: !!selectedChatId && selectedChatId !== TEMP_CHAT_ID,
  });

  //const selectedChat = chatRooms?.find(chat => chat.id === selectedChatId) || null;

  const { data: allUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => fetchAllUsers(),
  });

  useEffect(() => {
    if (!users || !selectedChatId || selectedChatId === TEMP_CHAT_ID) return;
    queryClient.setQueryData<Chat[]>(['chatRooms', userId], (chats): Chat[] => {
      const safeChats = chats ?? [];
      return safeChats.map(chat =>
        String(chat.id) === String(selectedChatId) ? { ...chat, users } : chat
      );
    });
  }, [users, selectedChatId, userId, queryClient]);

  //const handleUserSelect = (user: { id: string; username: string; image?: string }) => {
  //const newTempChat: Chat = {
  // id: TEMP_CHAT_ID,
  // name: user.username,
  // image: user.image || '',
  //  users: [user],
  //} as Chat;

  // setTempChat(newTempChat);
  // setSelectedChatId(TEMP_CHAT_ID);
  // setOpenNewChatDialog(false);
  // };


  useEffect(() => {
    if (
      chatRooms &&
      chatRooms.length > 0 &&
      selectedChatId === null &&
      !tempChat
    ) {
      setSelectedChatId(chatRooms[0].id);
    }
  }, [chatRooms, selectedChatId, tempChat]);


  const activeChat =
    tempChat && selectedChatId === tempChat.id
      ? tempChat
      : selectedChat;

  return (
    <WebSocketProvider>
      <div className="app-layout">
        <div className="sidebar">
          <SideBar
            servers={mockServers}
            activeId={activeId}
            onServerChange={id => setActiveId(id)}
            onAddServer={() => { }}
          />
        </div>
        <main className="main">
          <div className="page">
            <div className="container">
              <div className="container-content">
                <div className="app-header-bar">
                  <div className="app-header">AURORA</div>
                  <div className="app-header-button">
                    <LogoutButton />
                  </div>
                </div>

                <div className="panels">
                  {activeId === 'personal' && (
                    <>
                      <aside className="chat-list-panel">
                        <div className="chat-list-header">
                          <div className="chat-title">Chat</div>
                          <div className="new-chat-button-container">
                            <Button
                              className="new-chat-button"
                              variant="contained"
                              color="primary"
                              disableRipple
                              onClick={() => setOpenNewChatDialog(true)}
                            >
                              New Chat
                            </Button>
                          </div>
                        </div>

                        <ChatList
                          chats={tempChat ? [...(chatRooms || []), tempChat] : chatRooms || []}
                          onSelectChat={id => {
                            setSelectedChatId(id);
                            setIsSidebarOpen(false);
                            if (id != tempChat?.id) { setTempChat(null); }
                          }}
                          selectedChatId={selectedChatId}
                          unreadByGroup={unreadByGroup}
                        />
                      </aside>
                      <section className="chat-window-panel">
                        {activeChat && userId && (
                          <ChatWindow
                            currentUserId={userId}
                            chatRoom={activeChat}
                            isSidebarOpen={isSidebarOpen}
                            onOpenSidebar={() => setIsSidebarOpen(true)}
                            onCloseSidebar={() => setIsSidebarOpen(false)}
                            onChatCreated={(newId) =>
                              handleChatCreated({
                                newId,
                                userId,
                                tempChat,
                                queryClient,
                                setTempChat,
                                setSelectedChatId
                              })
                            }
                          />
                        )}
                      </section>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <NewChatDialog
          open={openNewChatDialog}
          onClose={() => setOpenNewChatDialog(false)}
          onUserSelect={(user) =>
            handleUserSelect({
              user,
              chatRooms,
              setSelectedChatId,
              setTempChat,
              closeDialog: () => setOpenNewChatDialog(false),
            })
          }
          allUsers={(allUsers || []).filter(u => u.id !== userId)}
        />
      </div >
    </WebSocketProvider >
  );
}

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) setUserId(user.uid);
    else console.warn('No authenticated user');
  }, []);

  if (!userId) {
    return <div style={loadingUserStyles}>Loading user…</div>;
  }

  return (
    <NotificationsProvider currentUserId={userId}>
      <AppInner userId={userId} />
    </NotificationsProvider>
  );
}
