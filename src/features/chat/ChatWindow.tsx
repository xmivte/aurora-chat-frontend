import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { type IMessage } from '@stomp/stompjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';

import { api } from '@/auth/utils/api';
import { BACKEND_URL } from '@/config/env';
import ChatSideBar, { type MembersInfo } from '@/features/sidebar/ChatSideBar.tsx';
import { auth } from '@/firebase';
import { useWebSocket } from '@/hooks/useWebSocket';

import { useNotifications } from '../notifications/useNotifications';

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

const CHARACTER_LIMIT = 2000;

async function fetchPinnedMessages(groupId: string): Promise<ApiPinnedMessage[]> {
  const res = await api.get<ApiPinnedMessage[]>(
    `/api/groups/${encodeURIComponent(groupId)}/pinned-messages`
  );
  return res.data;
}

const ChatWindow = ({
  currentUserId,
  chatRoom,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  onChatCreated,
}: ChatWindowProps) => {
  const { markGroupRead, playSendSound } = useNotifications();

  const groupId = useMemo(() => String(chatRoom?.id ?? ''), [chatRoom?.id]);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsernames, setTypingUsernames] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { client, isConnected, onlineUserIds } = useWebSocket();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [limitWarning, setLimitWarning] = useState(false);

  useEffect(() => {
    setTypingUsernames(
      typingUsers
        .map(id => chatRoom.users?.find(u => u.id === id)?.username)
        .filter((name): name is string => !!name)
    );
  }, [typingUsers, chatRoom.users]);

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

  const members: MembersInfo[] =
    chatRoom.users?.map(user => ({
      url: user.image || '',
      online: onlineUserIds.includes(user.id),
      username: user.username,
    })) || [];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
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

  const { data: fetchedMessages } = useQuery({
    queryKey: ['messages', chatRoom.id],
    queryFn: async () => {
      const res = await api.get(`/messages/${chatRoom.id}`);
      const data = res.data as ChatMessage[];
      return data.map((received: ChatMessage) => ({
        id: received.id,
        user: { id: received.senderId, username: received.username },
        content: received.content,
        date: new Date(received.createdAt),
        fk_chatId: received.groupId,
      }));
    },
    enabled: !!chatRoom.id,
  });

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if (!groupId) return;
    if (document.visibilityState !== 'visible') return;
    void markGroupRead(groupId);
  }, [groupId, messages, markGroupRead]);

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

  useEffect(() => {
    if (client && isConnected) {
      const chatSub = client.subscribe(`/topic/chat.${chatRoom.id}`, (message: IMessage) => {
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

        if (document.visibilityState === 'visible') {
          void markGroupRead(groupId);
        }

      });

      const typingSub = client.subscribe(
        `/topic/typing-users/${chatRoom.id}`,
        (message: IMessage) => {
          const received = JSON.parse(message.body) as string[];
          setTypingUsers(received.filter(id => id !== currentUserId));
        }
      );

      const pinSub = client.subscribe(`/topic/groups.${groupId}.pinned`, (msg: IMessage) => {
        const updated = JSON.parse(msg.body) as ApiPinnedMessage[];
        queryClient.setQueryData(pinnedQueryKey, updated);
      });

      return () => {
        chatSub.unsubscribe();
        typingSub.unsubscribe();
        pinSub.unsubscribe();
      };
    }
  }, [
    client,
    isConnected,
    chatRoom.id,
    groupId,
    pinnedQueryKey,
    queryClient,
    currentUserId,
    markGroupRead,
  ]);

const pinMessage = (message: Message): void => {
    if (!pinnedBy) return;
    if (!canPinMore) return;

    const payload = { messageId: message.id, pinnedBy };

    try {
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

  const createGroup = async (myUserId: string, otherUserId: string) => {
    try {
      const res = await api.post("/group", {
        myUserId,
        otherUserId,
      });
      return res.data;
    } catch (err) {
      console.error("Failed to create group:", err);
      throw err;
    }
  };


  const sendMessage = async () => {
    if (!input.trim()) return;

    let groupId = chatRoom.id;

    //New chat
    if (chatRoom.isDraft) {

      const otherUserId = chatRoom.users.find(u => u.id !== currentUserId)?.id;
      if (!otherUserId) {
        console.error("Could not determine other user");
        return;
      }

      const newGroup = await createGroup(currentUserId, otherUserId);

      groupId = newGroup.id;
      onChatCreated(newGroup.id);

      //Subscribe to new topic
      if (client && client.connected) {
        client.subscribe(`/topic/chat.${groupId}`, (message: IMessage) => {
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
      }
    }

    //Send the message (works for both: new + existing chats)
    if (!client?.connected) return;
    if (!groupId) return;

    const trimmed = input.trim();
    if (!trimmed) return;
    if (trimmed.length > CHARACTER_LIMIT) return;

    const payload = {
      groupId,
      content: trimmed,
      senderId: currentUserId,
    };

    client.publish({
      destination: '/app/send.message',
      body: JSON.stringify(payload),
    });

    if (client?.connected && isTyping) {
      setIsTyping(false);
      client.publish({
        destination: `/app/user.typing/stop/${chatRoom.id}`,
      });
    }

    playSendSound();
    setInput('');
    setLimitWarning(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <Container disableGutters maxWidth={false} sx={outerBoxSx}>
      <Box sx={outerBoxFullSx}>
        <Box sx={outerBoxOnlyChatSx}>
          <Box>
            <Header
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
        {isSidebarOpen && <ChatSideBar members={members} onClose={onCloseSidebar} />}
      </Box>
    </Container>
  );
};

export default ChatWindow;
