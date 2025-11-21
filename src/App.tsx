import { useState } from 'react';
import { LogoutButton } from './auth';
import './App.css';
import './index.css';
import chatsData from "./mock/data.json";
import ChatList from "./components/LeftPanel/ChatList";
import ChatWindow from "./components/ChatWindow";
import SideBar, { type Server } from './components/SideBar';

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
    const selectedChat = chatsData.find((chat) => chat.id === selectedChatId) || null;

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
                                chats={chatsData}
                                onSelectChat={setSelectedChatId}
                                selectedChatId={selectedChatId}
                            />
                        </aside>

                        <section className="chat-window-panel">
                            <div className="app-header-button"><LogoutButton /></div>
                            <ChatWindow chat={selectedChat} />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
