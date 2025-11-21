import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { JSX } from 'react';

import PersonalChatsIcon from '../assets/icons/personal-chats-icon.svg';
import { createSideBarSx } from '../themes/sidebar_style.ts';
import { DEFAULT_THEME, type ThemeColors } from '../themes/sidebar_theme.ts';

import { SideBarAddServerSection } from './SideBar_AddServer_Button.tsx';

export type Server = { id: string; label: string; glyph?: string; bg?: string };

export type SideBarProps = {
  servers: Server[];
  activeId: string;
  onServerChange: (id: string) => void;
  onAddServer?: () => void;
  themeColors?: ThemeColors;
};

const Static_side_bar_sx = createSideBarSx(DEFAULT_THEME);
const SideBar = ({ servers, activeId, onServerChange, onAddServer }: SideBarProps): JSX.Element => {
  const {
    containerSx,
    buttonSx,
    avatarSx,
    topStackSx,
    contentStackSx,
    footerStackSx,
    emptyStateTextSx,
    dividerSx,
    addServerSectionStackSx,
    addServerAvatarSx,
  } = Static_side_bar_sx;

  return (
    <Box sx={containerSx}>
      <Stack spacing={1} sx={topStackSx}>
        <Tooltip title="Personal Chats" placement="right">
          <IconButton onClick={() => onServerChange('personal')} disableRipple sx={buttonSx}>
            <Avatar
              src={PersonalChatsIcon}
              className="sb-avatar"
              sx={avatarSx(activeId === 'personal')}
            />
          </IconButton>
        </Tooltip>
        <Divider sx={dividerSx} />
      </Stack>
      <Stack spacing={1} sx={contentStackSx}>
        {servers.length > 0 ? (
          servers.map(s => {
            const isActive = s.id === activeId;
            return (
              <Tooltip key={s.id} title={s.label} placement="right">
                <IconButton onClick={() => onServerChange(s.id)} disableRipple sx={buttonSx}>
                  <Avatar className="sb-avatar" sx={avatarSx(isActive, s.bg)}>
                    {s.glyph ?? s.label.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            );
          })
        ) : (
          <Box sx={emptyStateTextSx}>No servers yet</Box>
        )}
      </Stack>

      {onAddServer && (
        <Box sx={footerStackSx}>
          <SideBarAddServerSection
            buttonSx={buttonSx}
            addServerSectionStackSx={addServerSectionStackSx}
            dividerSx={dividerSx}
            addServerAvatarSx={addServerAvatarSx}
            onAddServer={onAddServer}
          />
        </Box>
      )}
    </Box>
  );
};

export default SideBar;
