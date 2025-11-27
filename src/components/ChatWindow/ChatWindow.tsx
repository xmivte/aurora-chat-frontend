import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { ChatWindowProps } from '../../types/ChatWindowTypes';

import Header from './ChatHeader';
import MessageField from './ChatMessages';
import './ChatWindow.css';

const ChatWindow: React.FC<ChatWindowProps> = ({
  curretUserId,
  chatRoom,
  messages,
}: ChatWindowProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <>
      <Container className="chatWindow-outer-box">
        <Header curretUserId={curretUserId} chatRoom={chatRoom}></Header>
        <MessageField curretUserId={curretUserId} messages={messages}></MessageField>
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
