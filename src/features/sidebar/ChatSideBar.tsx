import { Paper, List, SxProps, Theme } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
 import CloseIcon from '@mui/icons-material/Close';
 import IconButton from '@mui/material/IconButton';

import TabsComponent from './ChatSideBarTabs';
import UserProfileComponent from './ChatUsersProfile';
import { type SideBarProps } from './types';

export interface MembersInfo {
  url: string;
  online: boolean;
  username: string;
}

const PaperStyling: SxProps<Theme> = {
  backgroundColor: 'rgb(38, 33, 61)',
  padding: '2px',
  width: '300px',
  color: 'white',
  marginLeft: '15px',
};

const ListTextStyling: SxProps<Theme> = {
  padding: '20px',
};

const ChatSideBar = ({ members, onClose }: SideBarProps & { onClose?: () => void }) => {
  const tabs = ['Info', 'Media'];

  return (
    <Paper sx={PaperStyling}>
      {onClose && (
        <IconButton onClick={onClose} sx={{ color: 'white', float: 'right' }}>
          <CloseIcon />
        </IconButton>
      )}
      <TabsComponent items={tabs} />
      <ListItemText sx={ListTextStyling} primary="Group Info" />

      <List>
        {members.map((member, i) => {
          return <UserProfileComponent key={i} {...member} />;
        })}
      </List>
    </Paper>
  );
};

export default ChatSideBar;
