import Avatar from '@mui/material/Avatar';
import avatar from './avatar.png';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { MessageProps } from '../types/ChatWindowTypes';
import './ChatMessages.css';

const ChatMessages: React.FC<MessageProps> = ({ curretUserId, messages }: MessageProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <>
      <Box className="chat-outer-box">
        {messages.map(message => (
          <Box
            key={message.id}
            className={
              curretUserId === message.user.id ? 'chat-message-reverse' : 'chat-message-row'
            }
          >
            <Box
              className={
                curretUserId === message.user.id
                  ? 'chat-message-content-end'
                  : 'chat-message-content-start'
              }
            >
              {message.user.image ? (
                <Box
                  component="img"
                  src={message.user.image}
                  alt="user"
                  className="chat-message-content-avatar"
                />
              ) : (
                <Avatar className="chat-message-content-avatar" src={avatar} />
              )}
              <Typography className="chat-message-content-dateName">
                {message.user.name}{' '}
                {message.date < yesterday
                  ? message.date.toLocaleDateString()
                  : message.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <Box className="chat-message-content-textbox">
                <Typography gutterBottom className="chat-message-content-text">
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
