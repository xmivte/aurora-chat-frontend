import { useState } from 'react';
import { LogoutButton } from './auth';
import './App.css';
//import './index.css';
import ChatWindow from './features/chat/ChatWindow.tsx';
import messages from './mock/messages.json';
import { Message } from './features/chat/index';
import ChatList from './features/chat/ChatList';
import SideBar, { type Server } from './features/server/SideBar';
import Button from '@mui/material/Button';
import chatsData from './mock/chats.json';
import UserSearch from "./features/search/UserSearch";

const mockServers: Server[] = [
  { id: 'a', label: 'Server A', glyph: 'A', bg: '#5553eb' },
  { id: 'b', label: 'Server B', glyph: 'B', bg: '#f5b400' },
  { id: 'c', label: 'DB Primary', glyph: 'DB', bg: '#0f766e' },
  { id: 'd', label: 'DB Replica', glyph: 'R', bg: '#1e293b' },
  { id: 'e', label: 'Cache', glyph: 'C', bg: '#2563eb' },
  { id: 'f', label: 'Worker 1', glyph: 'W1', bg: '#9333ea' },
];

const mockUsers = [
  { id: "1", name: "Alice Johnson", avatarUrl: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Bob Smith", avatarUrl: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Charlie Brown", avatarUrl: "https://i.pravatar.cc/150?img=3" },
  { id: "4", name: "Diana Prince", avatarUrl: "" },
];

export default function App() {
  const [activeId, setActiveId] = useState<string>('personal');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(chatsData[0].id);
  const selectedChat = chatsData.find(chat => chat.id === selectedChatId) || null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedChatMessages = messages.filter(message => message.fk_chatId === selectedChatId);

  const selectedChatMessagesParsed: Message[] = selectedChatMessages.map(msg => ({
    ...msg,
    date: new Date(msg.date),
  }));


  const handleUserSelect = (user: { id: string; name: string }) => {
    console.log("Selected user:", user);
    // Later: start a new chat, navigate to chat screen, etc.
  };


  return (
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
                <div style={{ width: '100%', margin: "2rem auto", paddingLeft: '65px', paddingRight: '40px' }}>
                  <UserSearch data={mockUsers} onUserSelect={handleUserSelect} />
                </div>
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
                        chats={chatsData}
                        onSelectChat={(id) => {
                          setSelectedChatId(id);
                          setIsSidebarOpen(false);
                        }}
                        selectedChatId={selectedChatId}
                      />
                    </aside>
                    <section className="chat-window-panel">
                      {selectedChat && (
                        <ChatWindow
                          currentUserId={1}
                          chatRoom={selectedChat}
                          messages={selectedChatMessagesParsed}
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


