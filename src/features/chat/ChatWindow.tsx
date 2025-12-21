import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Client, type IMessage } from '@stomp/stompjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

import { api } from '@/auth/utils/api';
import { getToken } from '@/auth/utils/fireBaseToken';
import { BACKEND_URL } from '@/config/env';

import { useNotifications } from '../notifications/useNotifications';
import ChatSideBar from '../sidebar/ChatSideBar.tsx';

import Header from './ChatHeader.tsx';
import MessageField from './ChatMessages.tsx';
import {
  outerBoxSx,
  messagesSx,
  inputSx,
  sendButtonSx,
  outerBoxFullSx,
  outerBoxOnlyChatSx,
} from './ChatWindow.ts';
import type { ChatWindowProps } from './ChatWindowTypes';

import type { ChatMessage, Message } from './index';

const CHARACTER_LIMIT = 2000;

// ---- small helpers to satisfy eslint no-unsafe-assignment
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const isChatMessage = (v: unknown): v is ChatMessage => {
  if (!isRecord(v)) return false;

  // Validate only what you actually use below
  return (
    'id' in v &&
    'senderId' in v &&
    'groupId' in v &&
    'content' in v &&
    'createdAt' in v &&
    'username' in v
  );
};

const ChatWindow = ({
  currentUserId,
  chatRoom,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
}: ChatWindowProps) => {
  const { markGroupRead, playSendSound } = useNotifications();

  const groupId = useMemo(() => String(chatRoom?.id ?? ''), [chatRoom?.id]);

  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [limitWarning, setLimitWarning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    setLimitWarning(value.length > CHARACTER_LIMIT);
  };

  const markReadIfVisible = useCallback(async () => {
    if (!groupId) return;
    if (document.visibilityState !== 'visible') return;
    await markGroupRead(groupId);
  }, [groupId, markGroupRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  // Fetch messages on room change
  useEffect(() => {
    if (!groupId) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await api.get<ChatMessage[]>(`/messages/${groupId}`);
        const data = res.data;

        const convertedMessages: Message[] = data.map(received => ({
          id: received.id,
          user: { id: received.senderId, name: received.username },
          content: received.content,
          date: new Date(received.createdAt),
          fk_chatId: String(received.groupId),
        }));

        if (isMounted) setMessages(convertedMessages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    void fetchMessages();
    void markReadIfVisible();

    return () => {
      isMounted = false;
    };
  }, [groupId, markReadIfVisible]);

  // Mark read when tab becomes visible
  useEffect(() => {
    if (!groupId) return;

    const onVis = () => {
      if (document.visibilityState === 'visible') {
        void markGroupRead(groupId);
      }
    };

    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [groupId, markGroupRead]);

  // WS subscribe
  useEffect(() => {
    if (!groupId) return;

    let disposed = false;
    let stompClient: Client | null = null;

    const connect = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.warn('[ChatWindow] no token for ws');
          return;
        }
        if (disposed) return;

        stompClient = new Client({
          webSocketFactory: () =>
            new SockJS(`${BACKEND_URL}/ws?token=${encodeURIComponent(token)}`),
          reconnectDelay: 3000,

          onConnect: () => {
            if (!stompClient) return;

            stompClient.subscribe(`/topic/chat.${groupId}`, (message: IMessage) => {
              try {
                const parsed: unknown = JSON.parse(message.body);

                if (!isChatMessage(parsed)) {
                  console.warn('[ChatWindow] received unknown ws payload', parsed);
                  return;
                }

                const received = parsed;

                const converted: Message = {
                  id: received.id,
                  user: { id: received.senderId, name: received.username },
                  content: received.content,
                  date: new Date(received.createdAt),
                  fk_chatId: String(received.groupId),
                };

                setMessages(prev => {
                  if (prev.some(m => m.id === converted.id)) return prev;
                  return [...prev, converted];
                });

                if (document.visibilityState === 'visible') {
                  void markGroupRead(groupId);
                }
              } catch (e) {
                console.warn('[ChatWindow] failed to parse chat message', e);
              }
            });
          },
        });

        stompClient.activate();
        setClient(stompClient);
      } catch (e) {
        console.warn('[ChatWindow] ws connect failed', e);
      }
    };

    void connect();

    return () => {
      disposed = true;
      setClient(null);

      if (stompClient) {
        try {
          void stompClient.deactivate();
        } catch {
          // ignore
        }
      }
    };
  }, [groupId, markGroupRead]);

  const sendMessage = () => {
    if (!client || !client.connected) return;
    if (!groupId) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    const payload = {
      groupId,
      content: trimmed,
      senderId: currentUserId,
    };

    client.publish({
      destination: '/app/send.message',
      body: JSON.stringify(payload),
    });

    playSendSound();
    setInput('');
    setLimitWarning(false);
  };

  return (
    <Container disableGutters maxWidth={false} sx={outerBoxSx}>
      <Box sx={outerBoxFullSx}>
        <Box sx={outerBoxOnlyChatSx}>
          <Box>
            <Header
              currentUserId={currentUserId}
              chatRoom={chatRoom}
              onOpenSidebar={onOpenSidebar}
            />
          </Box>

          <Box sx={messagesSx}>
            <MessageField currentUserId={currentUserId} messages={messages} />
            <div ref={messagesEndRef} />
          </Box>

          <TextField
            multiline
            fullWidth
            id="Input"
            placeholder="Type a message..."
            variant="outlined"
            error={limitWarning}
            helperText={limitWarning ? 'Reaching character limit' : ''}
            sx={inputSx}
            onChange={handleInputChange}
            value={input}
            slotProps={{
              htmlInput: { maxLength: CHARACTER_LIMIT },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={sendButtonSx} onClick={sendMessage}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {isSidebarOpen && chatRoom ? (
          <ChatSideBar members={chatRoom.users} onClose={onCloseSidebar} />
        ) : null}
      </Box>
    </Container>
  );
};

export default ChatWindow;
