import SockJS from 'sockjs-client';

import { ChatWindowProps } from '../../types/ChatWindowTypes';

import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Client, IMessage } from '@stomp/stompjs';
import './ChatWindow.css';
import { useState, useEffect } from 'react';

import { api } from '../../auth/utils/api';
import { getToken } from '../../auth/utils/fireBaseToken';
import { BACKEND_URL } from '../../config/env';
import { Message, ChatMessage } from '../../types/index.ts';

import Header from './ChatHeader';
import MessageField from './ChatMessages';

const ChatWindow: React.FC<ChatWindowProps> = ({ curretUserId, chatRoom }: ChatWindowProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [client, setClient] = useState<Client | null>(null);
  const [messagess, setMessages] = useState<Message[]>([]);
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
        senderId: curretUserId,
      };
      client.publish({
        destination: '/app/send.message',
        body: JSON.stringify(testMessage),
      });
      setInput('');
    }
  };
  return (
    <>
      <Container className="chatWindow-outer-box">
        <Header curretUserId={curretUserId} chatRoom={chatRoom}></Header>
        <MessageField curretUserId={curretUserId} messages={messagess}></MessageField>
        <TextField
          className="chatWindow-input"
          multiline
          fullWidth
          id="Input"
          placeholder="Type a message..."
          variant="outlined"
          value={input}
          error={limitWarning}
          helperText={limitWarning ? 'Reaching character limit' : ''}
          onChange={e => handleInputChange(e)}
          slotProps={{
            htmlInput: {
              maxLength: 2000,
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton className="chatWindow-input-send" onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Container>
    </>
  );
};
export default ChatWindow;
