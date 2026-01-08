import { ListItem, Badge, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

import theme from '../../theme/theme';

import {
  listItemStyles,
  onlineIndicatorPosition,
  onlineIndicatorForm,
} from './ChatUsersProfile.ts';
import { type MembersInfo } from './types';

const ChatUsersProfile = ({ username, online, url }: MembersInfo) => {
  return (
    <ListItem sx={listItemStyles}>
      <Badge
        overlap="circular"
        anchorOrigin={onlineIndicatorPosition}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            ...onlineIndicatorForm,
            backgroundColor: online
              ? theme.customColors.colorOnline
              : theme.customColors.colorInactive,
          },
        }}
      >
        <ListItemAvatar>
          <Avatar src={url} />
        </ListItemAvatar>
      </Badge>
      <ListItemText primary={username} />
    </ListItem>
  );
};

export default ChatUsersProfile;
