import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { MouseEvent, useState } from 'react';

import avatar from '../../assets/firstUser.svg';
import theme from '../../theme/theme';
import { FileAttachment } from '../files/components/FileAttachment/FileAttachment.tsx';

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
  messageActionsLeftSx,
  messageActionsRightSx,
  menuPaperMeSx,
  menuPaperOtherSx,
} from './ChatMessages';
import { MessageProps } from './ChatWindowTypes';

const ChatMessages = ({ currentUserId, messages, onPinMessage, canPin = true }: MessageProps) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [messageMenu, setMessageMenu] = useState<{
    anchorEl: HTMLElement;
    fromCurrentUser: boolean;
    messageId: number;
  } | null>(null);

  const handleOpenMenu = (
    event: MouseEvent<HTMLElement>,
    messageId: number,
    fromCurrentUser: boolean
  ) => {
    setMessageMenu({ anchorEl: event.currentTarget, fromCurrentUser, messageId });
  };

  const handleCloseMenu = () => {
    setMessageMenu(null);
  };

  const anchorHorizontal: 'left' | 'right' = messageMenu?.fromCurrentUser ? 'left' : 'right';
  const transformHorizontal: 'left' | 'right' = messageMenu?.fromCurrentUser ? 'right' : 'left';
  const menuOpen = Boolean(messageMenu);
  const selectedMessage = messageMenu
    ? (messages.find(m => m.id === messageMenu.messageId) ?? null)
    : null;

  return (
    <Box sx={outerBoxSx}>
      {messages.map(message => {
        const isCurrentUser = currentUserId === message.user.id;

        return (
          <Box key={message.id} sx={isCurrentUser ? messageReverseSx : messageRowSx}>
            <Box sx={isCurrentUser ? contentEndSx : contentStartSx}>
              {message.user.image ? (
                <Box component="img" src={message.user.image} alt="user" sx={avatarSx} />
              ) : (
                <Avatar sx={avatarSx} src={avatar} />
              )}
              <Typography sx={dateNameSx}>
                {message.user.username}{' '}
                {message.date < yesterday
                  ? message.date.toLocaleDateString()
                  : message.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>

              <Box sx={isCurrentUser ? textBoxMeSx : textBoxOtherSx}>
                {message.fileAttachments && message.fileAttachments.length > 0 && (
                  <Box sx={{ marginBottom: message.content ? 1 : 0 }}>
                    {message.fileAttachments.map(file => (
                      <FileAttachment key={file.id} file={file} />
                    ))}
                  </Box>
                )}

                {message.content && (
                  <Typography gutterBottom sx={textSx}>
                    {message.content}
                  </Typography>
                )}

                <Box
                  className="message-actions"
                  sx={isCurrentUser ? messageActionsLeftSx : messageActionsRightSx}
                >
                  <IconButton
                    size="small"
                    onClick={e => handleOpenMenu(e, message.id, isCurrentUser)}
                  >
                    <MoreVertIcon fontSize="small" sx={{ color: theme.customColors.colorText }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}

      <Menu
        anchorEl={messageMenu?.anchorEl ?? null}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: anchorHorizontal,
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: transformHorizontal,
        }}
        slotProps={{
          paper: {
            sx: messageMenu?.fromCurrentUser ? menuPaperMeSx : menuPaperOtherSx,
          },
        }}
      >
        <MenuItem
          disabled={!canPin}
          onClick={() => {
            if (selectedMessage) onPinMessage?.(selectedMessage);
            handleCloseMenu();
          }}
        >
          Pin message
        </MenuItem>
      </Menu>
    </Box>
  );
};
export default ChatMessages;
