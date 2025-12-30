import { ListItem, Badge, ListItemAvatar, ListItemText, Avatar, Box } from '@mui/material';

import theme from '../../theme/theme';

import {
  listItemStyles,
  onlineIndicatorPosition,
  onlineIndicatorForm,
  unreadCountStyles,
} from './ChatUsersProfile.ts';
import { type MembersInfo } from './types';

type Props = MembersInfo & {
  unreadCount?: number;
};

const ChatUsersProfile = ({ username, online, url, unreadCount = 0 }: Props) => {
  const showUnread = unreadCount > 0;

  return (
    <ListItem sx={listItemStyles}>
      <Badge
        overlap="circular"
        anchorOrigin={onlineIndicatorPosition}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            ...onlineIndicatorForm,
            backgroundColor: online ? theme.customColors.colorOnline : theme.customColors.colorBusy,
          },
        }}
      >
        <ListItemAvatar>
          <Avatar src={url} />
        </ListItemAvatar>
      </Badge>

      <ListItemText primary={username} />

      {showUnread ? (
        <Box aria-label="unread-count" sx={unreadCountStyles}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </Box>
      ) : null}
    </ListItem>
  );
};

export default ChatUsersProfile;
