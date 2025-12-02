import { Paper, List, SxProps, Theme } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import TabsComponent from './ChatSideBarTabs';
import UserProfileComponent from './ChatUsersProfile';
import { type SideBarProps } from './types';

const PaperStyling: SxProps<Theme> = {
  backgroundColor: 'rgb(38, 33, 61)',
  padding: '2px',
  width: '300px',
  color: 'white',
};

const ListTextStyling: SxProps<Theme> = {
  padding: '20px',
};

const ChatSideBar = ({ members }: SideBarProps) => {
  const tabs = ['Info', 'Media'];

  return (
    <Paper sx={PaperStyling}>
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
