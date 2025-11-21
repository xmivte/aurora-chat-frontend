import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ChatWindowProps } from '../types/ChatWindowTypes';

const ChatWindow: React.FC<ChatWindowProps> = ({
  curretUserId,
  chatRoom,
  messages,
}: ChatWindowProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <>
      <Container sx={{ bgcolor: '#282741', borderRadius: 4, p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box
            component="img"
            src={
              chatRoom.users.length === 2
                ? (chatRoom.users.find(user => user.id != curretUserId)?.image ?? undefined)
                : (chatRoom.image ?? undefined)
            }
            alt="chat-room"
            sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#FFFFFF' }}
          />
          {chatRoom.name === undefined && chatRoom.users.length === 2 ? (
            <Typography variant="h6" sx={{ m: 2 }}>
              {chatRoom.users.find(user => user.id != curretUserId)?.name}
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ m: 2 }}>
              {chatRoom.name || 'Chat room'}
            </Typography>
          )}
        </Box>
        <Box sx={{ height: '400px', overflowY: 'auto' }}>
          {messages.map(message => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: curretUserId === message.user.id ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: curretUserId === message.user.id ? 'flex-end' : 'flex-start',
                }}
              >
                {message.user.image ? (
                  <Box
                    component="img"
                    src={message.user.image}
                    alt="user"
                    sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#FFFFFF' }}
                  />
                ) : (
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#FFFFFF' }}>
                    <Avatar />
                  </Box>
                )}
                <Typography sx={{ m: 1 }}>
                  {message.user.name}{' '}
                  {message.date < yesterday
                    ? message.date.toLocaleDateString()
                    : message.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Box
                  sx={{ bgcolor: '#1B1A2F', display: 'inline-block', borderRadius: 4, p: 1, m: 1 }}
                >
                  <Typography gutterBottom sx={{ color: '#FFFFFF', fontSize: 14 }}>
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <TextField
          sx={{ bgcolor: '#1B1A2F', '& .MuiInputBase-input': { color: '#e2e1e2' } }}
          multiline
          fullWidth
          id="Input"
          placeholder="Type a message..."
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ '&:focus': { outline: 'none' } }}>
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
