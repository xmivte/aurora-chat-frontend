import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { HeaderProps } from '../../types/ChatWindowTypes';
import './ChatHeader.css';

const ChatHeader: React.FC<HeaderProps> = ({ curretUserId, chatRoom }: HeaderProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <>
      <Box className="chat-header-outer-box">
        <Box
          component="img"
          src={
            chatRoom.users.length === 2
              ? (chatRoom.users.find(user => user.id != curretUserId)?.image ?? undefined)
              : (chatRoom.image ?? undefined)
          }
          alt="chat-room"
          className="chat-header-avatar"
        />
        {chatRoom.name === undefined && chatRoom.users.length === 2 ? (
          <Typography variant="h6" className="chat-header-name">
            {chatRoom.users.find(user => user.id != curretUserId)?.name}
          </Typography>
        ) : (
          <Typography variant="h6" className="chat-header-name">
            {chatRoom.name || 'Chat room'}
          </Typography>
        )}
      </Box>
    </>
  );
};
export default ChatHeader;
