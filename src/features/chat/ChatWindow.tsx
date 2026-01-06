import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Client, type IMessage } from '@stomp/stompjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import SockJS from 'sockjs-client';

import firstUser from '@/assets/firstUser.svg';
import secondUser from '@/assets/secondUser.svg';
import thirdUser from '@/assets/thirdUser.svg';
import { api } from '@/auth/utils/api';
import { getToken } from '@/auth/utils/fireBaseToken';
import { BACKEND_URL } from '@/config/env';
import ChatSideBar, { type MembersInfo } from '@/features/sidebar/ChatSideBar.tsx';
import { auth } from '@/firebase';

import Header from './ChatHeader.tsx';
import MessageField from './ChatMessages.tsx';
import {
  outerBoxSx,
  messagesSx,
  inputSx,
  sendButtonSx,
  outerBoxFullSx,
  outerBoxOnlyChatSx,
  isTypingSx,
} from './ChatWindow.ts';
import { type ApiPinnedMessage, type PinnedMessage, type ChatWindowProps } from './ChatWindowTypes';
import { PINNED_MESSAGES_LIMIT } from './pinnedLimits';

import { type Message, type ChatMessage } from './index';

export const mockMembersList: MembersInfo[] = [
  { url: firstUser, online: false, username: 'Diana' },
  { url: secondUser, online: true, username: 'Tie' },
  { url: thirdUser, online: false, username: 'Ryan' },
  { url: '', online: true, username: 'Sam' },
];

async function fetchPinnedMessages(groupId: string): Promise<ApiPinnedMessage[]> {
  const res = await api.get<ApiPinnedMessage[]>(
    `/api/groups/${encodeURIComponent(groupId)}/pinned-messages`
  );
  return res.data;
}

const ChatWindow = ({
  currentUserId,
  chatRoom,
  users,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
}: ChatWindowProps) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsernames, setTypingUsernames] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const groupId = String(chatRoom.id);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [limitWarning, setLimitWarning] = useState(false);
  const CHARACTER_LIMIT = 2000;

  useEffect(() => {
    setTypingUsernames(
      typingUsers
        .map(id => users?.find(u => u.id === id)?.username)
        .filter((name): name is string => !!name)
    );
  }, [typingUsers]);

  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  useEffect(() => {
    return onAuthStateChanged(auth, user => setUid(user?.uid ?? null));
  }, []);

  const pinnedBy = uid ?? undefined;

  const pinnedQueryKey = useMemo(() => ['pinnedMessages', groupId] as const, [groupId]);

  const { data: pinnedRecords = [] } = useQuery<ApiPinnedMessage[]>({
    queryKey: pinnedQueryKey,
    queryFn: () => fetchPinnedMessages(groupId),
    enabled: Boolean(BACKEND_URL) && Boolean(groupId),
    refetchOnMount: 'always',
  });

  const pinnedCount = pinnedRecords.length;
  const canPinMore = pinnedCount < PINNED_MESSAGES_LIMIT;

  const pinnedMessages: PinnedMessage[] = useMemo(() => {
    return pinnedRecords.map(record => {
      const found = messages.find(m => m.id === record.messageId);

      const fallbackMessage: Message = {
        id: record.messageId,
        user: { id: 'unknown', username: 'Unknown user', image: null },
        content: '(Message not loaded)',
        date: new Date(record.pinnedAt),
        fk_chatId: chatRoom.id,
      };

      return {
        message: found ?? fallbackMessage,
        pinnedAt: new Date(record.pinnedAt),
      };
    });
  }, [pinnedRecords, messages, chatRoom.id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    const client = stompClientRef.current;
    if (client?.connected && !isTyping && value.length > 0) {
      setIsTyping(true);
      client.publish({
        destination: `/app/user.typing/start/${chatRoom.id}`,
      });
    } else if (client?.connected && isTyping && value.length == 0) {
      setIsTyping(false);
      client.publish({
        destination: `/app/user.typing/stop/${chatRoom.id}`,
      });
    }
    setInput(value);
    setLimitWarning(value.length > CHARACTER_LIMIT);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${chatRoom.id}`);
        const data = res.data as ChatMessage[];
        const convertedMessages: Message[] = data.map(received => ({
          id: received.id,
          user: { id: received.senderId, username: received.username },
          content: received.content,
          date: new Date(received.createdAt),
          fk_chatId: received.groupId,
        }));
        if (isMounted) setMessages(convertedMessages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    void fetchMessages();
    return () => {
      isMounted = false;
    };
  }, [chatRoom.id]);

  useEffect(() => {
    let isActive = true;
    let client: Client | null = null;

    const activate = async () => {
      try {
        const token = await getToken();
        if (!isActive) return;

        const wsUrl = token
          ? `${BACKEND_URL}/ws?token=${encodeURIComponent(token)}`
          : `${BACKEND_URL}/ws`;

        client = new Client({
          webSocketFactory: () => new SockJS(wsUrl),
          onConnect: () => {
            client?.subscribe(`/topic/chat.${chatRoom.id}`, (message: IMessage) => {
              const received = JSON.parse(message.body) as ChatMessage;
              const converted: Message = {
                id: received.id,
                user: { id: received.senderId, username: received.username },
                content: received.content,
                date: new Date(received.createdAt),
                fk_chatId: received.groupId,
              };

              setMessages(prev => {
                if (prev.some(m => m.id === converted.id)) return prev;
                return [...prev, converted];
              });
            });

            client?.subscribe(`/topic/typing-users/${chatRoom.id}`, (message: IMessage) => {
              const received = JSON.parse(message.body) as string[];
              setTypingUsers(received.filter(id => id !== currentUserId));
            });

            client?.subscribe(`/topic/groups.${groupId}.pinned`, (msg: IMessage) => {
              const updated = JSON.parse(msg.body) as ApiPinnedMessage[];
              queryClient.setQueryData(pinnedQueryKey, updated);
            });
          },
        });

        stompClientRef.current = client;
        client.activate();
      } catch (e) {
        console.error('Failed to activate websocket client:', e);
      }
    };

    void activate();

    return () => {
      isActive = false;
      stompClientRef.current = null;
      if (client) void client.deactivate();
    };
  }, [chatRoom.id, groupId, pinnedQueryKey, queryClient]);

  const pinMessage = (message: Message): void => {
    if (!pinnedBy) return;
    if (!canPinMore) return;

    const payload = { messageId: message.id, pinnedBy };

    try {
      const client = stompClientRef.current;
      if (!client?.connected) {
        console.error('WebSocket not connected - pin action skipped');
        return;
      }

      client.publish({
        destination: `/app/groups.${groupId}.pin`,
        body: JSON.stringify(payload),
      });

      void queryClient.invalidateQueries({ queryKey: pinnedQueryKey });
    } catch (error) {
      console.error('Failed to pin message', error);
    }
  };

  const discardPin = (messageId: number): void => {
    try {
      const client = stompClientRef.current;
      if (!client?.connected) {
        console.error('WebSocket not connected - unpin action skipped');
        return;
      }

      client.publish({
        destination: `/app/groups.${groupId}.unpin`,
        body: JSON.stringify({ messageId }),
      });

      void queryClient.invalidateQueries({ queryKey: pinnedQueryKey });
    } catch (error) {
      console.error('Failed to unpin message', error);
    }
  };

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (!client?.connected) return;

    const trimmed = input.trim();
    if (!trimmed) return;
    if (trimmed.length > CHARACTER_LIMIT) return;

    const outgoing = {
      groupId: chatRoom.id,
      content: trimmed,
      senderId: currentUserId,
    };

    client.publish({
      destination: '/app/send.message',
      body: JSON.stringify(outgoing),
    });

    if (client?.connected && isTyping) {
      setIsTyping(false);
      client.publish({
        destination: `/app/user.typing/stop/${chatRoom.id}`,
      });
    }

    setInput('');
    setLimitWarning(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <>
      <Container disableGutters maxWidth={false} sx={outerBoxSx}>
        <Box sx={outerBoxFullSx}>
          <Box sx={outerBoxOnlyChatSx}>
            <Box>
              <Header
                currentUserId={currentUserId}
                chatRoom={chatRoom}
                pinnedMessages={pinnedMessages}
                onDiscardPin={messageId => void discardPin(messageId)}
                onOpenSidebar={onOpenSidebar}
              />
            </Box>

            <Box sx={messagesSx}>
              <MessageField
                currentUserId={currentUserId}
                messages={messages}
                onPinMessage={message => void pinMessage(message)}
                canPin={canPinMore}
              />
              <div ref={messagesEndRef} />
            </Box>

            <Box id="chat-composer">
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
                  htmlInput: {
                    maxLength: CHARACTER_LIMIT,
                  },
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
              {typingUsernames.length > 0 && (
                <Box sx={isTypingSx}>
                  {typingUsernames.length === 1
                    ? `${typingUsernames[0]} is typing...`
                    : 'Multiple people are typing...'}
                </Box>
              )}
            </Box>
          </Box>
          {isSidebarOpen && <ChatSideBar members={mockMembersList} onClose={onCloseSidebar} />}
        </Box>
      </Container>
    </>
  );
};

export default ChatWindow;
