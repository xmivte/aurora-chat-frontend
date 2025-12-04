import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { HeaderProps } from '../../types/ChatWindowTypes';
import { outerBoxSx, avatarSx, nameSx, chatInfoBtnSx } from './ChatHeader';
import avatar from './assets/avatar.png';

const ChatHeader: React.FC<HeaderProps & { onOpenSidebar?: () => void }> = ({
  curretUserId,
  chatRoom,
  onOpenSidebar,}) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (!chatRoom) {
    return (
      <Box sx={{ ...outerBoxSx, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box component="img" src={avatar} alt="chat-room" sx={avatarSx} />
        <Typography variant="h6" sx={nameSx}>Chat room</Typography>
        {onOpenSidebar && (
          <IconButton
            onClick={onOpenSidebar}
            sx={{ marginLeft: 'auto', color: 'white' }}
            aria-label="Open chat sidebar"
          >
            <InfoIcon />
          </IconButton>
        )}
      </Box>
    );
  }

  const isDirectChat = chatRoom.users?.length === 2;
  const otherUser = isDirectChat
    ? chatRoom.users?.find(user => String(user.id) !== String(curretUserId))
    : null;

  return (
    <Box sx={{ ...outerBoxSx, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        component="img"
        src={isDirectChat ? (otherUser?.image || avatar) : (chatRoom.image || avatar)}
        alt="chat-room"
        sx={avatarSx}
      />

      {isDirectChat && !chatRoom.name ? (
        <Typography variant="h6" sx={nameSx}>
          {otherUser?.name ?? 'Unknown user'}
        </Typography>
      ) : (
        <Typography variant="h6" sx={nameSx}>
          {chatRoom.name ?? 'Chat room'}
        </Typography>
      )}
      <IconButton
        onClick={() => onOpenSidebar?.()}
        sx={chatInfoBtnSx}
        aria-label="Open chat sidebar">
        <InfoIcon />
      </IconButton>
    </Box>
  );
};

export default ChatHeader