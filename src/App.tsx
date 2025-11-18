import { useState } from 'react';

import { LogoutButton } from './auth';
import './App.css';

import SideBar, { type Server } from './components/SideBar';
import './index.css';

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
        <div>
          <h1>You are logged in</h1>
        </div>

        <LogoutButton />
      </main>
    </div>
  );
}
