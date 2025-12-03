import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { ChatWindowProps } from '../../types/ChatWindowTypes';
import Header from './ChatHeader.tsx';
import MessageField from './ChatMessages.tsx';
import { outerBoxSx, messagesSx, inputSx, sendButtonSx, outerBoxFullSx, outerBoxOnlyChatSx } from './ChatWindow';
import { useEffect, useRef } from 'react';
import ChatSideBar, { type MembersInfo } from '@/features/sidebar/ChatSideBar.tsx';
import firstUser from '@/assets/firstUser.svg';
import secondUser from '@/assets/secondUser.svg';
import thirdUser from '@/assets/thirdUser.svg';
import { Chat, Message } from '../../types/index';


export const mockMembersList: MembersInfo[] = [
  { url: firstUser, online: false, username: 'Diana' },
  { url: secondUser, online: true, username: 'Tie' },
  { url: thirdUser, online: false, username: 'Ryan' },
  { url: '', online: true, username: 'Sam' },
];


const ChatWindow: React.FC<ChatWindowProps> = ({
  curretUserId,
  chatRoom,
  messages,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
}) => {

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
                curretUserId={curretUserId}
                chatRoom={chatRoom}
                onOpenSidebar={onOpenSidebar}
              />
            </Box>
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
          </Box>
          {isSidebarOpen && (
            <ChatSideBar
              members={mockMembersList}
              onClose={onCloseSidebar}
            />
          )}
        </Box>
      </Container>
    </>
  );
};
export default ChatWindow;