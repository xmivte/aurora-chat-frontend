import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Client, IMessage } from '@stomp/stompjs';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';

import { providerSignInButton, backgroundContainer } from '../auth/styles/styles';

interface ChatMessage {
  groupId: number;
  content: string;
  senderId: number;
}

export default function WebSocketExample() {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        stompClient.subscribe('/topic/chat.1', (message: IMessage) => {
          const received = JSON.parse(message.body) as ChatMessage;
          setMessages(prev => [...prev, `Message: ${received.content}`]);
        });
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      void stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && client.connected) {
      const time = new Date().toLocaleTimeString();
      const testMessage = {
        groupId: 1,
        content: time,
        senderId: 1,
      };
      client.publish({
        destination: '/app/send.message',
        body: JSON.stringify(testMessage),
      });
    }
  };

  return (
    <Container sx={backgroundContainer}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          WebSocket Example
        </Typography>
        <Button sx={providerSignInButton} onClick={sendMessage}>
          Send Message
        </Button>

        <Box sx={{ mt: 2.5 }}>
          <Typography variant="h6" component="h4" gutterBottom>
            Messages:
          </Typography>
          <Paper
            sx={{
              height: 200,
              overflowY: 'auto',
              bgcolor: '#000000',
            }}
          >
            {messages.map((msg, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{ mb: 0.4, fontSize: '12px', color: '#ffffff' }}
              >
                {msg}
              </Typography>
            ))}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
