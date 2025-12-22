import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

import { useEffect, useRef } from 'react';

import firstUser from '@/assets/firstUser.svg';

import {
  outerBoxSx,
  messagesSx,
  inputSx,
  sendButtonSx,
  outerBoxFullSx,
  outerBoxOnlyChatSx,
} from './ChatWindow.ts';

import secondUser from '@/assets/secondUser.svg';
import thirdUser from '@/assets/thirdUser.svg';
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
} from './ChatWindow.ts';
import { ChatWindowProps } from './ChatWindowTypes';

export const mockMembersList: MembersInfo[] = [
  { url: firstUser, online: false, username: 'Diana' },
  { url: secondUser, online: true, username: 'Tie' },
  { url: thirdUser, online: false, username: 'Ryan' },
  { url: '', online: true, username: 'Sam' },
];

const ChatWindow = ({
  currentUserId,
  chatRoom,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
}: ChatWindowProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [limitWarning, setLimitWarning] = useState(false);
  const CHARACTER_LIMIT = 2000;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
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
          user: { id: received.senderId, name: received.username },
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
              user: { id: received.senderId, name: received.username },
              content: received.content,
              date: new Date(received.createdAt),
              fk_chatId: received.groupId,
            };
            setMessages(prev => {
              if (prev.some(m => m.id === converted.id)) return prev;
              return [...prev, converted];
            });
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
          </Box>
          {isSidebarOpen && <ChatSideBar members={mockMembersList} onClose={onCloseSidebar} />}
        </Box>
      </Container>
    </>
  );
};
export default ChatWindow;
