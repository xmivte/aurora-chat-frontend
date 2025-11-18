import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

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
    </Stack>
  );
}
