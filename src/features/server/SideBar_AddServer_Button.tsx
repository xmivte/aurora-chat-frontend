import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

import settingsIcon from './assets/settings_gear_icon.svg';

type Props = {
  buttonSx: object;
  addServerSectionStackSx: object;
  dividerSx: object;
  addServerAvatarSx: object;
  onAddServer: () => void;
};

export function SideBarAddServerSection({
  buttonSx,
  addServerSectionStackSx,
  dividerSx,
  addServerAvatarSx,
  onAddServer,
}: Props) {
  const navigate = useNavigate();
  const switchToSettings = () => {
    void navigate('settings');
  };

  return (
    <Stack spacing={1} sx={addServerSectionStackSx}>
      <Divider sx={dividerSx} />
      <Tooltip title="Add server" placement="right">
        <IconButton onClick={onAddServer} disableRipple sx={buttonSx}>
          <Avatar className="sb-avatar" sx={addServerAvatarSx}>
            +
          </Avatar>
        </IconButton>
      </Tooltip>
      <Tooltip title="Settings" placement="right">
        <IconButton onClick={() => switchToSettings()} disableRipple sx={buttonSx}>
          <Avatar src={settingsIcon} className="sb-avatar" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
