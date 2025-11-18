// typescript
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useMemo } from 'react';

import PersonalChatsIcon from '../assets/icons/personal-chats-icon.svg';

export type Server = { id: string; label: string; glyph?: string; bg?: string };

export type ThemeColors = {
  gradientStart: string;
  gradientMiddle?: string;
  gradientEnd: string;
  sidebarOverlay?: string;
  accent: string;
  avatarBg: string;
  divider: string;
  mutedText: string;
};

export type SideBarProps = {
  servers: Server[];
  activeId: string;
  onServerChange: (id: string) => void;
  onAddServer?: () => void;
  themeColors?: ThemeColors;
};

const DEFAULT_THEME: ThemeColors = {
  gradientStart: '#1b1228',
  gradientMiddle: '#2e1642',
  gradientEnd: '#7b2f7b',
  sidebarOverlay: 'rgba(0,0,0,0.55)',
  accent: '#ff63c9',
  avatarBg: '#2b1b3a',
  divider: 'rgba(255,255,255,0.06)',
  mutedText: '#80848e',
};

export default function SideBar({
  servers,
  activeId,
  onServerChange,
  onAddServer,
  themeColors = DEFAULT_THEME,
}: SideBarProps) {
  const colors = themeColors;

  const buttonSx = useMemo(
    () => ({
      p: 0,
      borderRadius: '14px',
      '&:hover .sb-avatar': { transform: 'scale(1.12)' },
      '&:focus': { outline: 'none' },
    }),
    []
  );

  const avatarSx = (isActive: boolean, bg?: string) => ({
    bgcolor: bg ?? colors.avatarBg,
    width: 48,
    height: 48,
    borderRadius: '14px',
    fontWeight: 600,
    border: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
    boxSizing: 'border-box',
    transition: 'transform 150ms cubic-bezier(.2,.8,.2,1)',
    '& img': { width: 32, height: 32, objectFit: 'contain' },
  });

  return (
    <Box
      sx={{
        width: 72,
        height: '100vh',
        background: `linear-gradient(180deg, ${colors.gradientStart} 0%, ${colors.gradientMiddle ?? colors.gradientStart} 45%, ${colors.gradientEnd} 100%)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack spacing={1} sx={{ p: 1, alignItems: 'center', flexShrink: 0 }}>
        <Tooltip title="Personal Chats" placement="right">
          <IconButton onClick={() => onServerChange('personal')} disableRipple sx={buttonSx}>
            <Avatar
              src={PersonalChatsIcon}
              className="sb-avatar"
              sx={avatarSx(activeId === 'personal')}
            />
          </IconButton>
        </Tooltip>
        <Divider sx={{ width: '60%', bgcolor: colors.divider }} />
      </Stack>

      <Stack
        spacing={1}
        sx={{
          p: 1,
          alignItems: 'center',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
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
          <Box
            sx={{
              color: colors.mutedText,
              fontSize: 12,
              textAlign: 'center',
              px: 1,
              py: 2,
            }}
          >
            No servers yet
          </Box>
        )}
      </Stack>

      {onAddServer && (
        <Stack spacing={1} sx={{ p: 1, alignItems: 'center', flexShrink: 0 }}>
          <Divider sx={{ width: '60%', bgcolor: colors.divider }} />
          <Tooltip title="Add server" placement="right">
            <IconButton onClick={onAddServer} disableRipple sx={buttonSx}>
              <Avatar
                className="sb-avatar"
                sx={{
                  ...avatarSx(false),
                  color: colors.accent,
                  fontSize: 24,
                  fontWeight: 300,
                }}
              >
                +
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Box>
  );
}
