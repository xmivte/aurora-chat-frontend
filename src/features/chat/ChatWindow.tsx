import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { ChatWindowProps } from '../../types/ChatWindowTypes';
import Header from './ChatHeader';
import MessageField from './ChatMessages';
import './ChatWindow.css';
import { useEffect, useRef } from 'react';

const ChatWindow: React.FC<ChatWindowProps> = ({
  curretUserId,
  chatRoom,
  messages,
}: ChatWindowProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  {/* const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);*/}

  return (
    <>
      <Container className="chatWindow-outer-box">
        <Header curretUserId={curretUserId} chatRoom={chatRoom}></Header>
        <div className="chatWindow-messages">
          <MessageField curretUserId={curretUserId} messages={messages}></MessageField>
          {/*<div ref={messagesEndRef} />*/}
        </div>
        <TextField
          className="chatWindow-input"
          multiline
          fullWidth
          id="Input"
          placeholder="Type a message..."
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton className="chatWindow-input-send">
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