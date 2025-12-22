import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import avatar from './assets/avatar.png';
import {
  outerBoxSx,
  messageRowSx,
  messageReverseSx,
  contentStartSx,
  contentEndSx,
  avatarSx,
  dateNameSx,
  textBoxOtherSx,
  textBoxMeSx,
  textSx,
} from './ChatMessages';
import { MessageProps } from './ChatWindowTypes';


const ChatMessages = ({ currentUserId, messages }: MessageProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <>
      <Box sx={outerBoxSx}>
        {messages.map(message => (
          <Box
            key={message.id}
            sx={currentUserId === message.user.id ? messageReverseSx : messageRowSx}
          >
            <Box sx={currentUserId === message.user.id ? contentEndSx : contentStartSx}>
              {message.user.image ? (
                <Box component="img" src={message.user.image} alt="user" sx={avatarSx} />
              ) : (
                <Avatar sx={avatarSx} src={avatar} />
              )}
              <Typography sx={dateNameSx}>
                {message.user.name}{' '}
                {message.date < yesterday
                  ? message.date.toLocaleDateString()
                  : message.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Box sx={currentUserId === message.user.id ? textBoxMeSx : textBoxOtherSx}>
                <Typography gutterBottom sx={textSx}>
                  {message.content}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};
export default ChatMessages;
