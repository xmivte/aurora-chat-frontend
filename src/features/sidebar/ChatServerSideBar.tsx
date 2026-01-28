import CloseIcon from '@mui/icons-material/Close';
import { Paper, List } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/auth/utils/api.ts';
import { useWebSocket } from '@/hooks/useWebSocket.ts';

import avatar from '../../assets/firstUser.svg';
import { User } from '../chat/index.ts';

import { paperStyles, listTextStyles, closeButtonStyles } from './ChatSideBar.ts';
import TabsComponent from './ChatSideBarTabs.tsx';
import UserProfileComponent from './ChatUsersProfile.tsx';
import { MembersInfo, ServerSideBarProps } from './types';

const fetchServerUsers = async (serverId: number): Promise<User[]> => {
  const res = await api.get<User[]>(`/user/server/${serverId}`);
  return res.data;
};

const ChatServerSideBar = ({
  serverId,
  onClose,
}: ServerSideBarProps & { onClose?: () => void }) => {
  const tabs = ['Info'];
  const { onlineUserIds } = useWebSocket();

  const { data: serverUsers } = useQuery<User[]>({
    queryKey: ['users', serverId],
    queryFn: () => fetchServerUsers(serverId),
    enabled: !!serverId,
  });

  const members: MembersInfo[] =
    serverUsers?.map(user => ({
      id: user.id,
      url: user.image || '',
      online: onlineUserIds.includes(user.id),
      username: user.username,
    })) || [];

  return (
    <Paper sx={paperStyles}>
      {onClose && (
        <IconButton onClick={onClose} sx={closeButtonStyles}>
          <CloseIcon />
        </IconButton>
      )}

      <TabsComponent items={tabs} />
      <ListItemText sx={listTextStyles} primary="Server Info" />

      <List>
        {members.map(member => (
          <UserProfileComponent
            key={member.id}
            id={member.id}
            username={member.username}
            online={false}
            url={member.url ? member.url : avatar}
          />
        ))}
      </List>
    </Paper>
  );
};

export default ChatServerSideBar;
