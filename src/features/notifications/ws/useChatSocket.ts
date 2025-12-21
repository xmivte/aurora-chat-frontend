import { Client } from '@stomp/stompjs';
import { getAuth } from 'firebase/auth';
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';

import type { NotificationEventDTO } from '../types/notifications';

export type UseChatSocketOptions = {
  currentUserId: string;
  onNotification: (evt: NotificationEventDTO) => void;
};

function getApiBaseUrl(): string {
  const viteUrl = (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL;
  return (viteUrl ?? 'http://localhost:8080').replace(/\/$/, '');
}

export function useChatSocket({ currentUserId, onNotification }: UseChatSocketOptions) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;

    void (async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          console.warn('[WS] No firebase token available');
          return;
        }
        if (cancelled) return;

        const API_BASE = getApiBaseUrl();
        const WS_URL = `${API_BASE}/ws?token=${encodeURIComponent(token)}`;

        const client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          reconnectDelay: 3000,
          debug: () => {},

          onConnect: () => {
            client.subscribe('/user/queue/notifications', frame => {
              try {
                const payload = JSON.parse(frame.body) as NotificationEventDTO;
                onNotification(payload);
              } catch (e) {
                console.warn('[WS] Failed to parse notification', e, frame.body);
              }
            });
          },

          onStompError: frame => {
            console.warn('[WS] STOMP error', frame.headers['message'], frame.body);
          },

          onWebSocketError: event => {
            console.warn('[WS] WebSocket error', event);
          },

          // jei lint verkia dėl unused param — paprasčiausiai išimk param
          onWebSocketClose: () => {},
        });

        client.activate();
        clientRef.current = client;
      } catch (e) {
        console.warn('[WS] connect failed', e);
      }
    })();

    return () => {
      cancelled = true;
      const c = clientRef.current;
      clientRef.current = null;
      if (c) {
        void c.deactivate().catch(() => {
          // ignore
        });
      }
    };
  }, [currentUserId, onNotification]);
}
