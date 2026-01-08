import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { MouseEvent, useState } from 'react';

import avatar from '../../assets/firstUser.svg';

import pinIcon from './assets/pin-message-icon.png';
import {
  headerBoxSx,
  avatarSx,
  nameSx,
  chatInfoBtnSx,
  pinButtonSx,
  pinIconSx,
  pinMenuHeaderSx,
  pinMenuListSx,
  pinMenuEmptySx,
  pinMenuListRootSx,
  pinnedItemSx,
  pinnedAvatarSx,
  pinnedMetaRowSx,
  pinnedNameSx,
  pinnedTimeSx,
  pinnedContentSx,
  pinnedDiscardButtonSx,
  pinnedBodySx,
  getPinMenuPaperSx,
  getPinMenuFooterSx,
} from './ChatHeader';
import { HeaderProps } from './ChatWindowTypes';
import { PINNED_MESSAGES_LIMIT } from './pinnedLimits';

const ChatHeader = ({
  currentUserId,
  chatRoom,
  pinnedMessages,
  onDiscardPin,
  onOpenPinnedMenu,
  onOpenSidebar,
}: HeaderProps & { onOpenSidebar?: () => void }) => {
  const [pinAnchor, setPinAnchor] = useState<HTMLElement | null>(null);
  const [pinMenuMaxHeight, setPinMenuMaxHeight] = useState<number | null>(null);

  const handleOpenPinMenu = (event: MouseEvent<HTMLElement>) => {
    onOpenPinnedMenu?.();
    const anchorEl = event.currentTarget;
    setPinAnchor(anchorEl);

    const composer = document.getElementById('chat-composer');
    if (!composer) {
      setPinMenuMaxHeight(null);
      return;
    }

    const anchorRect = anchorEl.getBoundingClientRect();
    const composerRect = composer.getBoundingClientRect();

    const available = composerRect.top - anchorRect.bottom - 12;
    const clamped = Math.max(180, Math.floor(available));
    setPinMenuMaxHeight(clamped);
  };

  const handleClosePinMenu = () => {
    setPinAnchor(null);
  };

  if (!chatRoom) {
    return (
      <Box sx={headerBoxSx}>
        <Box component="img" src={avatar} alt="chat-room" sx={avatarSx} />
        <Typography variant="h6" sx={nameSx}>
          Chat room
        </Typography>

        {onOpenSidebar && (
          <IconButton
            onClick={onOpenSidebar}
            sx={{ ...chatInfoBtnSx, marginLeft: 'auto' }}
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
    ? chatRoom.users?.find(user => String(user.id) !== String(currentUserId))
    : null;

  return (
    <>
      <Box sx={headerBoxSx}>
        <Box
          component="img"
          src={isDirectChat ? otherUser?.image || avatar : chatRoom.image || avatar}
          alt="chat-room"
          sx={avatarSx}
        />

        <Typography variant="h6" sx={nameSx}>
          {isDirectChat && !chatRoom.name
            ? (otherUser?.username ?? 'Unknown user')
            : (chatRoom.name ?? 'Chat room')}
        </Typography>

        {onOpenSidebar && (
          <IconButton onClick={onOpenSidebar} sx={chatInfoBtnSx} aria-label="Open chat sidebar">
            <InfoIcon />
          </IconButton>
        )}

        <IconButton aria-label="Pinned messages" sx={pinButtonSx} onClick={handleOpenPinMenu}>
          <Box component="img" src={pinIcon} sx={pinIconSx} />
        </IconButton>
      </Box>

      <Menu
        anchorEl={pinAnchor}
        open={Boolean(pinAnchor)}
        onClose={handleClosePinMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ sx: pinMenuListRootSx }}
        slotProps={{
          paper: {
            sx: getPinMenuPaperSx(pinMenuMaxHeight),
          },
        }}
      >
        <Typography sx={pinMenuHeaderSx}>Pinned Messages</Typography>

        <Box sx={pinMenuListSx}>
          {pinnedMessages.length === 0 ? (
            <Box sx={pinMenuEmptySx}>No pinned messages</Box>
          ) : (
            pinnedMessages.map(pin => (
              <Box key={pin.message.id} sx={pinnedItemSx}>
                <Box
                  component="img"
                  src={pin.message.user.image || avatar}
                  alt={pin.message.user.username}
                  sx={pinnedAvatarSx}
                />
                <Box sx={pinnedBodySx}>
                  <Box sx={pinnedMetaRowSx}>
                    <Box sx={pinnedNameSx}>{pin.message.user.username}</Box>
                    <Box sx={pinnedTimeSx}>
                      {pin.pinnedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Box>
                    <Button
                      variant="text"
                      disableRipple
                      sx={pinnedDiscardButtonSx}
                      onClick={() => onDiscardPin?.(pin.message.id)}
                    >
                      Discard
                    </Button>
                  </Box>
                  <Box sx={pinnedContentSx}>{pin.message.content}</Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Box sx={getPinMenuFooterSx(pinnedMessages.length)}>
          Pin message count: {pinnedMessages.length}/{PINNED_MESSAGES_LIMIT}
        </Box>
      </Menu>
    </>
  );
};

export default ChatHeader;
