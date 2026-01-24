import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';

import type { Chat, ServerChat, User } from '@/features/chat';

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
import { chatInfoBtnSx } from './features/chat/ChatHeader.ts';
import ChatList from './features/chat/ChatList.tsx';
import ChatWindow from './features/chat/ChatWindow.tsx';
import {
  getChatDisplayName,
  getChatDisplayImage,
} from './features/chat/helpers/getChatDisplayInfo.ts';
import { handleUserSelect, handleChatCreated } from './features/chat/logic/chatActions.ts';
import { NotificationsProvider } from './features/notifications/NotificationsProvider';
import { useNotifications } from './features/notifications/useNotifications';
import NewChatDialog from './features/search/NewChatDialog.tsx';
import NewServerDialog from './features/server/NewServerDialog.tsx';
import ServerDeleteDialog from './features/server/ServerDeleteDialog.tsx';
import { Server } from './features/server/ServerTypes.ts';
import SideBar from './features/server/SideBar';
import ChatServerSideBar from './features/sidebar/ChatServerSideBar.tsx';

const TEMP_CHAT_ID = '__temp_new_chat__';

export function serverChatToChat(serverChat: ServerChat): Chat {
  const { serverId: _serverId, ...chat } = serverChat;
  return chat;
}

const fetchChatRooms = async (userId: string): Promise<Chat[]> => {
  const res = await api.get<Chat[]>(`/group/${userId}`);
  return res.data;
};

const fetchServerChatRooms = async (userId: string): Promise<ServerChat[]> => {
  const res = await api.get<ServerChat[]>(`/group/server/${userId}`);
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
  const [activeId, setActiveId] = useState<number>(-1);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [selectedServerChatId, setSelectedServerChatId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isServerSidebarOpen, setIsServerSidebarOpen] = useState(false);

  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [openNewServerDialog, setOpenNewServerDialog] = useState(false);
  const [openServerDeleteDialog, setOpenServerDeleteDialog] = useState(false);

  const [tempChat, setTempChat] = useState<Chat | null>(null);

  const queryClient = useQueryClient();
  const { unreadByGroup } = useNotifications();

  const { data: chatRooms } = useQuery<Chat[]>({
    queryKey: ['chatRooms', userId],
    queryFn: async () => {
      const rooms = await fetchChatRooms(userId);
      return rooms.map(room => ({
        ...room,
        displayName: getChatDisplayName(room, userId),
        displayImage: getChatDisplayImage(room, userId),
      }));
    },
    enabled: !!userId,
  });

  const { data: serverChatRooms } = useQuery<ServerChat[]>({
    queryKey: ['serverChatRooms', userId],
    queryFn: async () => {
      const rooms = await fetchServerChatRooms(userId);
      return rooms.map(room => ({
        ...room,
        displayName: getChatDisplayName(room, userId),
        displayImage: getChatDisplayImage(room, userId),
      }));
    },
    enabled: !!userId,
  });

  const selectedChat = useMemo(() => {
    if (!chatRooms || !selectedChatId) return null;
    return chatRooms.find(chat => String(chat.id) === String(selectedChatId)) || null;
  }, [chatRooms, selectedChatId]);

  const selectedServerChat = useMemo(() => {
    if (!serverChatRooms || !selectedServerChatId) return null;
    return serverChatRooms.find(chat => String(chat.id) === String(selectedServerChatId)) || null;
  }, [serverChatRooms, selectedServerChatId]);

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

  const { data: fetchedServers } = useQuery<Server[]>({
    queryKey: ['servers', userId],
    queryFn: async () => {
      const res = await api.get<Server[]>(`/server/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (chatRooms && chatRooms.length > 0 && selectedChatId === null && !tempChat) {
      setSelectedChatId(chatRooms[0].id);
    }
  }, [chatRooms, selectedChatId, tempChat]);

  useEffect(() => {
    if (serverChatRooms && serverChatRooms.length > 0 && selectedServerChatId === null) {
      setSelectedServerChatId(serverChatRooms[0].id);
    }
  }, [serverChatRooms, selectedServerChatId, tempChat]);

  const activeChat = tempChat && selectedChatId === tempChat.id ? tempChat : selectedChat;
  return (
    <WebSocketProvider>
      <div className="app-layout">
        <div className="sidebar">
          <SideBar
            servers={fetchedServers || []}
            activeId={activeId}
            onServerChange={id => setActiveId(id)}
            onAddServer={() => setOpenNewServerDialog(true)}
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
                  {activeId === -1 && (
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
                            if (id != tempChat?.id) {
                              setTempChat(null);
                            }
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
                            onChatCreated={newId =>
                              handleChatCreated({
                                newId,
                                userId,
                                tempChat,
                                queryClient,
                                setTempChat,
                                setSelectedChatId,
                              })
                            }
                          />
                        )}
                      </section>
                    </>
                  )}
                  {activeId !== -1 && (
                    <>
                      <aside className="chat-list-panel">
                        <div className="chat-list-header">
                          <div>
                            <div className="chat-title">Topics</div>
                            {fetchedServers?.find(server => server.id == activeId)?.userId ===
                              userId && (
                              <Button
                                className="new-chat-button"
                                variant="contained"
                                color="primary"
                                disableRipple
                                onClick={() => setOpenServerDeleteDialog(true)}
                              >
                                Delete server
                              </Button>
                            )}
                            <IconButton
                              onClick={() => setIsServerSidebarOpen(true)}
                              sx={{ ...chatInfoBtnSx, marginLeft: 'auto' }}
                              aria-label="Open chat sidebar"
                            >
                              <InfoIcon />
                            </IconButton>
                          </div>
                        </div>
                        <ChatList
                          chats={
                            serverChatRooms
                              ?.filter(chat => chat.serverId === activeId)
                              .map(({ serverId: _serverId, ...chat }) => chat) ?? []
                          }
                          onSelectChat={id => {
                            setSelectedServerChatId(id);
                            setIsSidebarOpen(false);
                            if (id != tempChat?.id) {
                              setTempChat(null);
                            }
                          }}
                          selectedChatId={selectedChatId}
                          unreadByGroup={unreadByGroup}
                        />
                      </aside>
                      {isServerSidebarOpen && (
                        <ChatServerSideBar
                          serverId={activeId}
                          onClose={() => setIsServerSidebarOpen(false)}
                        />
                      )}
                      <section className="chat-window-panel">
                        {selectedServerChat && userId && (
                          <ChatWindow
                            currentUserId={userId}
                            chatRoom={serverChatToChat(selectedServerChat)}
                            isSidebarOpen={isSidebarOpen}
                            onOpenSidebar={() => setIsSidebarOpen(true)}
                            onCloseSidebar={() => setIsSidebarOpen(false)}
                            onChatCreated={newId =>
                              handleChatCreated({
                                newId,
                                userId,
                                tempChat,
                                queryClient,
                                setTempChat,
                                setSelectedChatId,
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
        <ServerDeleteDialog
          open={openServerDeleteDialog}
          onClose={() => {
            setOpenServerDeleteDialog(false);
            setActiveId(-1);
          }}
          userId={userId}
          serverId={activeId}
        />
        <NewServerDialog
          open={openNewServerDialog}
          onClose={() => setOpenNewServerDialog(false)}
          userId={userId}
        />
        <NewChatDialog
          open={openNewChatDialog}
          onClose={() => setOpenNewChatDialog(false)}
          onUserSelect={user =>
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
      </div>
    </WebSocketProvider>
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
