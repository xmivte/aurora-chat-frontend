import {
  ListItem,
  Badge,
  ListItemAvatar,
  ListItemText,
  Avatar,
  BadgeProps,
  SxProps,
  Theme,
} from '@mui/material';
import { type MembersInfo } from './types';
import {
  listItemStyles,
  onlineIndicatorPosition,
  onlineIndicatorForm,
} from './ChatUsersProfile.ts';


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
            backgroundColor: online ? 'green' : 'red',
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
