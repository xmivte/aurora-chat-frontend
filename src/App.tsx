import { useState } from 'react';

import { LogoutButton } from './auth';
import './App.css';
import './index.css';
import ChatWindow from './components/ChatWindow/ChatWindow';
import ChatList from './components/LeftPanel/ChatList';
import SideBar, { type Server } from './components/SideBar';
import chatMock from './mock/chats.json';
import messages from './mock/messages.json';
import { Message } from './types/index';

const mockServers: Server[] = [
  { id: 'a', label: 'Server A', glyph: 'A', bg: '#5553eb' },
  { id: 'b', label: 'Server B', glyph: 'B', bg: '#f5b400' },
  { id: 'c', label: 'DB Primary', glyph: 'DB', bg: '#0f766e' },
  { id: 'd', label: 'DB Replica', glyph: 'R', bg: '#1e293b' },
  { id: 'e', label: 'Cache', glyph: 'C', bg: '#2563eb' },
  { id: 'f', label: 'Worker 1', glyph: 'W1', bg: '#9333ea' },
];

export default function App() {
  const [activeId, setActiveId] = useState<string>('me');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const selectedChat = chatMock.find(chat => chat.id === selectedChatId) || null;

  const selectedChatMessages = messages.filter(message => message.fk_chatId === selectedChatId);

  const selectedChatMessagesParsed: Message[] = selectedChatMessages.map(msg => ({
    ...msg,
    date: new Date(msg.date),
  }));

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
                chats={chatMock}
                onSelectChat={setSelectedChatId}
                selectedChatId={selectedChatId}
              />
            </aside>

            <section className="chat-window-panel">
              <div className="app-header-button">
                <LogoutButton />
              </div>
              {selectedChat && (
                <ChatWindow
                  curretUserId={1}
                  chatRoom={selectedChat}
                  messages={selectedChatMessagesParsed}
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
