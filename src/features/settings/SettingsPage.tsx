import { Box, Typography, TextField, Paper, Snackbar } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { CSSProperties, type ChangeEvent } from 'react';
import { useContext, useState } from 'react';

import { LogoutButton } from '@/auth';
import { UserCxt } from '@/main';

import DeleteButton from './DeleteButton';
import UpdateButton from './UpdateButton';
import { updateUsersUsername } from './userApi';

const backgroundStyle: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at top, #1a1630, #0b0a12)',
};

const profileAreaStyle: SxProps<Theme> = {
  width: 420,
  p: 4,
  borderRadius: 4,
  background: 'rgba(20, 18, 35, 0.9)',
};

const textFieldStyle: SxProps<Theme> = {
  mt: 0.5,
  input: { color: '#fff' },
  fieldset: { borderColor: 'rgba(255,255,255,0.1)' },
};

const profilePictureStyle: CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  objectFit: 'cover',
};

const SettingsPage = () => {
  const { user, setUser } = useContext(UserCxt)!;
  const [newUsername, setNewUsername] = useState(
    user.username.substring(0, user.username.indexOf('#'))
  );
  const [infoMessage, setInfoMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (newUsername: string) => updateUsersUsername(newUsername),
    onSuccess: data => {
      setInfoMessage('Username updated');
      setUser(data);
    },
    onError: () => {
      setInfoMessage("Can't update username");
    },
  });

  const textFieldsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfoMessage('');
    setNewUsername(e.target.value);
  };

  const updateUsername = () => {
    mutation.mutate(newUsername);
  };

  return (
    <Box sx={backgroundStyle}>
      <Paper elevation={0} sx={profileAreaStyle}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#8b7cf6' }}>
          Account
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <img src={user.image} alt={user.username} style={profilePictureStyle} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Change Username
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={newUsername}
              onChange={textFieldsChange}
              variant="outlined"
              sx={textFieldStyle}
            />
            <UpdateButton updateUsername={updateUsername} />
          </Box>
        </Box>
        <LogoutButton />
        <DeleteButton />
        <Snackbar open={infoMessage != ''} message={infoMessage} />
      </Paper>
    </Box>
  );
};

export default SettingsPage;
