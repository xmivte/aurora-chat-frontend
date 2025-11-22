import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { logoutButton } from '../styles/styles';

const LogoutButton = () => {
  const [busy, setBusy] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setBusy(true);
    try {
      await signOut(auth);
      void navigate('/login');
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <Button sx={logoutButton} onClick={() => void handleLogout()} disabled={busy}>
      Logout
    </Button>
  );
};

export default LogoutButton;
