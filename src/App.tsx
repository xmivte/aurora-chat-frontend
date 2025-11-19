import { useState } from 'react';

import { LogoutButton } from './auth';
import './App.css';
import chatsData from "./mock/data.json";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

function App() {
  //const [count, setCount] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const selectedChat = chatsData.find((chat) => chat.id === selectedChatId) || null;

  return (
    <>
      <div>
        <h1>You are logged in</h1>
    <div className="page">
      <div className="container">
        <aside className="chat-list-panel">
          <div className="app-header">AURORA</div>
            <ChatList
              chats={chatsData}
              onSelectChat={setSelectedChatId}
              selectedChatId={selectedChatId}
            /> 
        </aside>
        <main className="chat-window-panel">
          <ChatWindow chat={selectedChat} />
        </main>
      </div>
    </div>
</div>


    </>
  );
}

export default App;
