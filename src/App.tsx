import { useState } from 'react';

import { LogoutButton } from './auth';
import './App.css';
import './index.css';
//import ChatWindow from './components/ChatWindow'; 
import ChatWindow from './features/chat/ChatWindow';
import messages from './mock/messages.json';
import { Message } from './types/index';


import ChatList from './features/chat/ChatList';
import SideBar, { type Server } from './features/server/SideBar';

import Button from '@mui/material/Button';

import chatsData from './mock/chats.json';

const mockServers: Server[] = [
  { id: 'a', label: 'Server A', glyph: 'A', bg: '#5553eb' },
  { id: 'b', label: 'Server B', glyph: 'B', bg: '#f5b400' },
  { id: 'c', label: 'DB Primary', glyph: 'DB', bg: '#0f766e' },
  { id: 'd', label: 'DB Replica', glyph: 'R', bg: '#1e293b' },
  { id: 'e', label: 'Cache', glyph: 'C', bg: '#2563eb' },
  { id: 'f', label: 'Worker 1', glyph: 'W1', bg: '#9333ea' },
];

export default function App() {
  const [activeId, setActiveId] = useState<string>('personal');
  const [selectedChatId, setSelectedChatId] = useState<number | null>(chatsData[0].id);
  const selectedChat = chatsData.find(chat => chat.id === selectedChatId) || null;

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
                            onClick={() => setSelectedChatId(-1)} // new chat
                          >
                            New Chat
                          </Button>
                        </div>
                      </div>
                      <ChatList
                        chats={chatsData}
                        onSelectChat={setSelectedChatId}
                        selectedChatId={selectedChatId}
                      />
                    </aside>
                    <section className="chat-window-panel">
                     {/*  <ChatWindow chat={selectedChat} selectedChatId={selectedChatId} />*/}


                    {selectedChat && (
                        <ChatWindow
                          curretUserId={1}
                          chatRoom={selectedChat}
                          messages={selectedChatMessagesParsed}
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

{
  /* <<<<<<< HEAD
import chatMock from './mock/chats.json';
import messages from './mock/messages.json';
import { Message } from './types/index';
=======
import Button from '@mui/material/Button';
>>>>>>> 0a3dc21 (fixed layout and added new chat btn)

<<<<<<< HEAD
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
=======*/



 {/*  <ChatWindow chat={selectedChat} selectedChatId={selectedChatId} />*/}



}
