import { SxProps, Theme } from '@mui/system';

export const container: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
  padding: 1,
  backgroundColor: 'transparent',
  borderRadius: 1,
  mb: 1,
};

export const fileChip: SxProps<Theme> = {
  maxWidth: 200,
  height: 'auto',
  px: 0.5,
  py: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'rgba(255, 255, 255, 0.9)',
  '& svg': { color: '#90caf9' },
};

export const fileInfo: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0.25,
};

export const fileName: SxProps<Theme> = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.9)',
};

export const fileSize: SxProps<Theme> = {
  fontSize: '0.7rem',
  color: 'rgba(255, 255, 255, 0.6)',
};
