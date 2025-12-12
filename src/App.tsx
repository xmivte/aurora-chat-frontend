import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';

import { LogoutButton } from './auth';
import './App.css';
import './index.css';
import ChatWindow from './components/ChatWindow/ChatWindow';
import ChatList from './components/LeftPanel/ChatList';
import SideBar, { type Server } from './components/SideBar';
import { Chat, User } from './types/index';

const mockServers: Server[] = [
  { id: 'a', label: 'Server A', glyph: 'A', bg: '#5553eb' },
  { id: 'b', label: 'Server B', glyph: 'B', bg: '#f5b400' },
  { id: 'c', label: 'DB Primary', glyph: 'DB', bg: '#0f766e' },
  { id: 'd', label: 'DB Replica', glyph: 'R', bg: '#1e293b' },
  { id: 'e', label: 'Cache', glyph: 'C', bg: '#2563eb' },
  { id: 'f', label: 'Worker 1', glyph: 'W1', bg: '#9333ea' },
];

type JwtPayload = {
  id: number;
};

function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  const payload = token.split('.')[1];
  try {
    return JSON.parse(atob(payload)) as JwtPayload;
  } catch (e) {
    console.error('Invalid JWT:', e);
    return null;
  }
}
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export default function App() {
  const [activeId, setActiveId] = useState<string>('me');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>();
  const [chatRooms, setChatRooms] = useState<Chat[]>([]);

  const selectedChat = chatRooms.find(chat => chat.id === selectedChatId) || null;

  useEffect(() => {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      token = localStorage.getItem('JWT');
      if (!token) {
        console.warn('No token found');
        return;
      }
    }
    const decodedToken = decodeJwt(token);
    setUserId(decodedToken?.id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchChatRooms() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const res = await fetch(`${BACKEND_URL}/group/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = (await res.json()) as Chat[];
        setChatRooms(data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    }
    void fetchChatRooms();
  }, [userId]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        if (selectedChatId === null) return;
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const res = await fetch(`${BACKEND_URL}/user/${selectedChatId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const users = (await res.json()) as User[];
        setChatRooms(prev =>
          prev.map(chat => (chat.id === selectedChatId ? { ...chat, users } : chat))
        );
      } catch (error) {
        console.error('Error fetching users for chat room:', error);
      }
    }
    void fetchUsers();
  }, [selectedChatId]);

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
            <aside className="chat-list-panel">
              <div className="app-header">AURORA</div>
              <ChatList
                chats={chatRooms}
                onSelectChat={setSelectedChatId}
                selectedChatId={selectedChatId}
              />
            </aside>

            <section className="chat-window-panel">
              <div className="app-header-button">
                <LogoutButton />
              </div>
              {selectedChat && userId && selectedChat.users && (
                <ChatWindow curretUserId={userId} chatRoom={selectedChat} />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
