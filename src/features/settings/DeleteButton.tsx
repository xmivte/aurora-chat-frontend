import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SxProps,
  Theme,
} from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import theme from '@/theme/theme.ts';

import { deleteUser } from './userApi.ts';

const dialogPaperStyles: SxProps<Theme> = {
  backgroundColor: theme.customColors.colorBlueDark,
  color: theme.customColors.colorText,
  borderRadius: theme.customShape.roundedContainer,
};

const deleteActionStyles: SxProps<Theme> = {
  background: theme.customColors.colorPink,
  borderRadius: theme.customShape.roundedBtn,
};

const deleteAccButton: SxProps<Theme> = {
  p: '10px 0',
  borderRadius: theme.customShape.roundedBtn,
  background: theme.customColors.btnLogout,
  lineHeight: 1.4,
  fontSize: '16px',
  color: theme.customColors.colorText,
  width: '150px',
  '&:hover': {
    background: theme.palette.primary.main,
  },
};

const DeleteButton = () => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => !busy && setOpen(false);

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteUser();
      await signOut(auth);
      setOpen(false);
      void navigate('/login');
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <>
      <Button sx={deleteAccButton} onClick={handleOpen} disabled={busy}>
        Delete Account
      </Button>

      <Dialog open={open} onClose={handleClose} slotProps={{ paper: { sx: dialogPaperStyles } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Permanently delete account?</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: theme.customColors.colorMutedText }}>
            This action cannot be undone. All your messages and data will be permanently removed
            from our servers.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            sx={{ color: theme.customColors.colorText }}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button onClick={() => void handleDelete()} disabled={busy} sx={deleteActionStyles}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
