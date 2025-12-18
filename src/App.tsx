import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';

import { LogoutButton } from './auth';
import './App.css';
import { api } from './auth/utils/api';
import ChatList from './features/chat/ChatList';
import ChatWindow from './features/chat/ChatWindow.tsx';
import { Chat, User } from './features/chat/index.ts';
import SideBar, { type Server } from './features/server/SideBar';

import Button from '@mui/material/Button';

const mockServers: Server[] = [
  { id: 'a', label: 'Server A', glyph: 'A', bg: '#5553eb' },
  { id: 'b', label: 'Server B', glyph: 'B', bg: '#f5b400' },
  { id: 'c', label: 'DB Primary', glyph: 'DB', bg: '#0f766e' },
  { id: 'd', label: 'DB Replica', glyph: 'R', bg: '#1e293b' },
  { id: 'e', label: 'Cache', glyph: 'C', bg: '#2563eb' },
  { id: 'f', label: 'Worker 1', glyph: 'W1', bg: '#9333ea' },
];

const fetchChatRooms = async (userId: string): Promise<Chat[]> => {
  const res = await api.get<Chat[]>(`/group/${userId}`);
  return res.data;
};

const fetchUsers = async (selectedChatId: number): Promise<User[]> => {
  const res = await api.get<User[]>(`/user/${selectedChatId}`);
  return res.data;
};

export default function App() {
  const [activeId, setActiveId] = useState<string>('me');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: chatRooms } = useQuery<Chat[]>({
    queryKey: ['chatRooms', userId],
    queryFn: () => fetchChatRooms(userId as string),
    enabled: !!userId,
  });
  const selectedChat = chatRooms?.find(chat => chat.id === selectedChatId) || null;

  const { data: users } = useQuery<User[]>({
    queryKey: ['users', selectedChatId],
    queryFn: () => fetchUsers(selectedChatId as number),
    enabled: !!selectedChatId,
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      console.warn('No authenticated user');
    }
  }, []);

  useEffect(() => {
    if (!users || !selectedChatId) return;
    queryClient.setQueryData<Chat[]>(['chatRooms', userId], chats =>
      (chats ?? []).map(chat => (chat.id === selectedChatId ? { ...chat, users } : chat))
    );
  }, [users, selectedChatId, userId, queryClient]);

  return (
    <div className="app-layout">
      <div className="sidebar">
        <SideBar
          servers={mockServers}
          activeId={activeId}
          onServerChange={id => setActiveId(id)}
          onAddServer={() => {}}
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
                            onClick={() => setSelectedChatId(-1)}
                          >
                            New Chat
                          </Button>
                        </div>
                      </div>
                      <ChatList
                        chats={chatRooms || []}
                        onSelectChat={id => {
                          setSelectedChatId(id);
                          setIsSidebarOpen(false);
                        }}
                        selectedChatId={selectedChatId}
                      />
                    </aside>
                    <section className="chat-window-panel">
                      {selectedChat && userId && (
                        <ChatWindow
                          currentUserId={userId}
                          chatRoom={selectedChat}
                          isSidebarOpen={isSidebarOpen}
                          onOpenSidebar={() => setIsSidebarOpen(true)}
                          onCloseSidebar={() => setIsSidebarOpen(false)}
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
    </div>
  );
}
