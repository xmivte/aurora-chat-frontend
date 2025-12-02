import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { ChatWindowProps } from '../../types/ChatWindowTypes';
import Header from './ChatHeader.tsx';
import MessageField from './ChatMessages.tsx';

import { outerBoxSx, messagesSx, inputSx, sendButtonSx } from './ChatWindow';

import { useEffect, useRef } from 'react';

const ChatWindow: React.FC<ChatWindowProps> = ({
  curretUserId,
  chatRoom,
  messages,
}: ChatWindowProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

   const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <>
      <Container disableGutters maxWidth={false} sx={outerBoxSx}>
        <Header curretUserId={curretUserId} chatRoom={chatRoom}></Header>
        <Box sx={messagesSx}>
          <MessageField curretUserId={curretUserId} messages={messages}></MessageField>
          <div ref={messagesEndRef} />
        </Box>
        <TextField
          multiline
          fullWidth
          id="Input"
          placeholder="Type a message..."
          variant="outlined"
          sx={inputSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={sendButtonSx}>
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