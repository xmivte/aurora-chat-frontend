import { useState } from 'react';

import { LogoutButton } from './auth';
import './App.css';
import ChatWindow from './components/ChatWindow';
import ChatList from './components/LeftPanel/ChatList';
import chatMock from './mock/chats.json';
import messages from './mock/messages.json';
import { Message } from './types/index';

function App() {
  //const [count, setCount] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const selectedChat = chatMock.find(chat => chat.id === selectedChatId) || null;

  const selectedChatMessages = messages.filter(message => message.fk_chatId === selectedChatId);

  const selectedChatMessagesParsed: Message[] = selectedChatMessages.map(msg => ({
    ...msg,
    date: new Date(msg.date),
  }));

  return (
    <>
      <div>
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
            <main className="chat-window-panel">
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
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
