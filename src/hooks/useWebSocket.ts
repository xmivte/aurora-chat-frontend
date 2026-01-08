import { Client } from '@stomp/stompjs';
import { createContext, useContext } from 'react';

export interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
  onlineUserIds: string[];
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
