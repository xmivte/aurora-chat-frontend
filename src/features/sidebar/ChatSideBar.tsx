import { Paper, List, SxProps, Theme } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TabsComponent from './ChatSideBarTabs';
import UserProfileComponent from './ChatUsersProfile';
import { type SideBarProps } from './types';
import { paperStyles, listTextStyles, closeButtonStyles } from './ChatSideBar.ts';

export interface MembersInfo {
  url: string;
  online: boolean;
  username: string;
}

const ChatSideBar = ({ members, onClose }: SideBarProps & { onClose?: () => void }) => {
  const tabs = ['Info', 'Media'];

  return (
    <Paper sx={paperStyles}>
      {onClose && (
        <IconButton onClick={onClose} sx={closeButtonStyles}>
          <CloseIcon />
        </IconButton>
      )}
      <TabsComponent items={tabs} />
      <ListItemText sx={listTextStyles} primary="Group Info" />

      <List>
        {members.map((member, i) => {
          return <UserProfileComponent key={i} {...member} />;
        })}
      </List>
    </Paper>
  );
};

export default ChatSideBar;
