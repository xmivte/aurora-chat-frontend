import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

import firstUser from '@/assets/firstUser.svg';
import secondUser from '@/assets/secondUser.svg';
import thirdUser from '@/assets/thirdUser.svg';
import { api } from '@/auth/utils/api';
import { getToken } from '@/auth/utils/fireBaseToken';
import { BACKEND_URL } from '@/config/env';
import ChatSideBar, { type MembersInfo } from '@/features/sidebar/ChatSideBar.tsx';

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
import { ChatWindowProps } from './ChatWindowTypes';

import { Message, ChatMessage } from './index';

export const mockMembersList: MembersInfo[] = [
  { url: firstUser, online: false, username: 'Diana' },
  { url: secondUser, online: true, username: 'Tie' },
  { url: thirdUser, online: false, username: 'Ryan' },
  { url: '', online: true, username: 'Sam' },
];

const ChatWindow = ({
  currentUserId,
  chatRoom,
  users,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
}: ChatWindowProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsernames, setTypingUsernames] = useState<string[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${chatRoom.id}`);
        const data = res.data as ChatMessage[];
        const convertedMessages: Message[] = data.map((received: ChatMessage) => ({
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
    const stopActivate = async () => {
      const token = await getToken();
      const stompClient = new Client({
        webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws?token=${token}`),
        onConnect: () => {
          stompClient.subscribe(`/topic/chat.${chatRoom.id}`, (message: IMessage) => {
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
          stompClient.subscribe(`/topic/typing-users/${chatRoom.id}`, (message: IMessage) => {
            const received = JSON.parse(message.body) as string[];
            setTypingUsers(received.filter(id => id !== currentUserId));
          });
        },
      });
      stompClient.activate();
      setClient(stompClient);
      return () => {
        void stompClient.deactivate();
      };
    };
    void stopActivate();
  }, [chatRoom.id]);

  const sendMessage = () => {
    if (client && client.connected) {
      const testMessage = {
        groupId: chatRoom.id,
        content: input,
        senderId: currentUserId,
      };
      client.publish({
        destination: '/app/send.message',
        body: JSON.stringify(testMessage),
      });
      setInput('');
    }
    if (client?.connected && isTyping) {
      setIsTyping(false);
      client.publish({
        destination: `/app/user.typing/stop/${chatRoom.id}`,
      });
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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
                onOpenSidebar={onOpenSidebar}
              />
            </Box>
            <Box sx={messagesSx}>
              <MessageField currentUserId={currentUserId} messages={messages}></MessageField>
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
              onChange={e => handleInputChange(e)}
              value={input}
              slotProps={{
                htmlInput: {
                  maxLength: 2000,
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
          {isSidebarOpen && <ChatSideBar members={mockMembersList} onClose={onCloseSidebar} />}
        </Box>
      </Container>
    </>
  );
};
export default ChatWindow;
