import CloseIcon from '@mui/icons-material/Close';
import { Paper, List } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paperStyles, listTextStyles, closeButtonStyles } from './ChatSideBar.ts';
import TabsComponent from './ChatSideBarTabs.tsx';
import UserProfileComponent from './ChatUsersProfile.tsx';
import { type MembersInfo } from './types';

const ChatSideBar = ({ members, onClose }: { members: MembersInfo[]; onClose?: () => void }) => {
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
        {members.map((member, index) => (
          <UserProfileComponent
            key={index}
            username={member.username}
            online={member.online}
            url={member.url}
          />
        ))}
      </List>
    </Paper>
  );
};

export default ChatSideBar;
