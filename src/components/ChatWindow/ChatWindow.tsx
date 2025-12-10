import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Client, IMessage } from '@stomp/stompjs';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { ChatWindowProps } from '../../types/ChatWindowTypes';
import Header from './ChatHeader';
import MessageField from './ChatMessages';
import './ChatWindow.css';
import { getAuth } from "firebase/auth";

import { Message, ChatMessage } from '../../types/index.ts';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const ChatWindow: React.FC<ChatWindowProps> = ({
  curretUserId,
  chatRoom
}: ChatWindowProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [client, setClient] = useState<Client | null>(null);
  const [messagess, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [limitWarning, setLimitWarning] = useState(false);

  useEffect(() => {
    const characterLimitWarning = 2000;
    if (input.length > characterLimitWarning) {
      setLimitWarning(true);
    } else {
      setLimitWarning(false);
    }  
  }, [input]);

  useEffect(() => {
  let isMounted = true;
  const fetchMessages = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      const res = await fetch(`${BACKEND_URL}/messages/${chatRoom.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }});
      console.log('Fetching messages for chat room:', chatRoom.id);
      const data = await res.json();
      console.log('Fetched messages:', data);
      const convertedMessages: Message[] = data.map((received: ChatMessage ) => ({
        id: received.id,
        user: { id: received.senderId,
                name: received.username, },
        content: received.content,
        date: (new Date(received.createdAt)),
        fk_chatId: received.groupId }));
      if (isMounted) setMessages(convertedMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
  fetchMessages();
  return () => {
    isMounted = false;
  };
}, [chatRoom.id]);

  useEffect(() => {
    const stopActivate = async () => {
      const token = await getAuth().currentUser?.getIdToken();
      const stompClient = new Client({
        webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
        connectHeaders: {
        Authorization: `Bearer ${token}`,   // ⬅️ TOKEN GOES HERE
        },
        onConnect: () => {
          stompClient.subscribe(`/topic/chat.${chatRoom.id}`, (message: IMessage) => {
            const received = JSON.parse(message.body) as ChatMessage;
            console.log('Received message:', received);
            const converted : Message = { 
              id: received.id, 
              user: { id: received.senderId, 
                      name: received.username }, 
              content: received.content, 
              date: new Date(received.createdAt), 
              fk_chatId: received.groupId };
            setMessages(prev => [...prev, converted]);
          });
        },
      });
      stompClient.activate();
      setClient(stompClient);
      return () => {
        void stompClient.deactivate();
      };
    };
    stopActivate();
  }, []);

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
          helperText={limitWarning ? "Reaching character limit" : ""}
          onChange={(e) => setInput(e.target.value)}
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
