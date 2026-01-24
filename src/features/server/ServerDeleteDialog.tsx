import CloseIcon from '@mui/icons-material/Close';
import { Container, Box, Typography, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../auth/utils/api';
import theme from '../../theme/theme';

import { backdropStyles, paperStyles, closeButtonStyles } from './NewChatDialog.ts';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  serverId: number;
}

const deleteServer = async (serverId: number): Promise<void> => {
  await api.delete(`/server/${serverId}`);
};

const ServerDeleteDialog = ({ open, onClose, userId, serverId }: NewChatDialogProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteServer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['servers', userId] });
      await queryClient.invalidateQueries({ queryKey: ['serverChatRooms', userId] });
    },
  });

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteMutation.mutate(serverId);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: backdropStyles,
        paper: paperStyles,
      }}
    >
      <IconButton aria-label="close" onClick={onClose} sx={closeButtonStyles}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Container maxWidth="sm">
          <Box
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: theme.palette.secondary.main,
            }}
          >
            <Typography variant="h5" gutterBottom color="white">
              Do you really want to delete the Server
            </Typography>

            <Button onClick={handleConfirm} variant="contained" fullWidth sx={{ mt: 3 }}>
              Confirm
            </Button>

            <Button onClick={onClose} variant="contained" fullWidth sx={{ mt: 3 }}>
              Cancel
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default ServerDeleteDialog;
