import { SxProps } from '@mui/system';

export const container: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  padding: '8px 12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 2,
  maxWidth: 300,
  my: 0.5,
};

export const icon: SxProps = {
  color: '#90caf9',
  fontSize: 24,
};

export const fileInfo: SxProps = {
  flex: 1,
  minWidth: 0,
};

export const fileName: SxProps = {
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'rgba(255, 255, 255, 0.9)',
};

export const fileSize: SxProps = {
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '0.75rem',
};

export const downloadButton: SxProps = {
  color: '#90caf9',
  '&:hover': {
    backgroundColor: 'rgba(144, 202, 249, 0.1)',
  },
};
