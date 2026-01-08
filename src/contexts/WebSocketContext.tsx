import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useState, ReactNode, useRef } from 'react';
import SockJS from 'sockjs-client';

import { getToken } from '@/auth/utils/fireBaseToken';
import { BACKEND_URL } from '@/config/env';
import { WebSocketContext } from '@/hooks/useWebSocket';
const pingIntervalLength = 60000; // one minute

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    let pingInterval: ReturnType<typeof setInterval>;
    let isMounted = true;

    const setupUserStatusTracking = (stompClient: Client) => {
      // Initial ping to announce online status
      stompClient.publish({ destination: '/app/user.ping' });

      // Subscribe to online users list
      stompClient.subscribe('/app/online-users', (message: IMessage) => {
        const users = JSON.parse(message.body) as string[];
        setOnlineUserIds(users);
      });

      stompClient.subscribe('/topic/online-users', (message: IMessage) => {
        const users = JSON.parse(message.body) as string[];
        setOnlineUserIds(users);
      });

      // Periodic ping to keep session online
      return setInterval(() => {
        if (stompClient.connected) {
          stompClient.publish({ destination: '/app/user.ping' });
        }
      }, pingIntervalLength);
    };

    const initWebSocket = async () => {
      try {
        const token = await getToken();
        if (!isMounted) return;

        const stompClient = new Client({
          webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws?token=${token}`),
          onConnect: () => {
            setIsConnected(true);
            pingInterval = setupUserStatusTracking(stompClient);
          },
          onDisconnect: () => {
            setIsConnected(false);
          },
          onStompError: frame => {
            console.error('Broker error:', frame.headers['message']);
            console.error('Details:', frame.body);
          },
        });

        stompClient.activate();
        setClient(stompClient);
        clientRef.current = stompClient;
      } catch (error) {
        console.error('Failed to initialize WebSocket', error);
      }
    };

    void initWebSocket();

    return () => {
      isMounted = false;
      if (pingInterval) clearInterval(pingInterval);
      if (clientRef.current) {
        void clientRef.current.deactivate();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ client, isConnected, onlineUserIds }}>
      {children}
    </WebSocketContext.Provider>
  );
};
