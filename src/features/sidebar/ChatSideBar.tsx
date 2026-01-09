import CloseIcon from '@mui/icons-material/Close';
import { Paper, List } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paperStyles, listTextStyles, closeButtonStyles } from './ChatSideBar.ts';
import TabsComponent from './ChatSideBarTabs.tsx';
import UserProfileComponent from './ChatUsersProfile.tsx';
import { type SideBarProps } from './types';
import avatar from '../../assets/firstUser.svg';

const ChatSideBar = ({ members, onClose }: SideBarProps & { onClose?: () => void }) => {
  const tabs = ['Info'];

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
        {members.map(member => (
          <UserProfileComponent
            id={member.id}
            username={member.username}
            online={false}
            url={member.image ? member.image : avatar}
          />
        ))}
      </List>
    </Paper>
  );
};

export default ChatSideBar;
