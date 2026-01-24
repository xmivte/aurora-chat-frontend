import CloseIcon from '@mui/icons-material/Close';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { api } from '../../auth/utils/api';
import theme from '../../theme/theme';

import { backdropStyles, paperStyles, closeButtonStyles } from './NewChatDialog.ts';
import { PostServer, Server } from './ServerTypes.ts';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const createPost = async (data: PostServer): Promise<Server> => {
  const res = await api.post<Server>('/server', data);
  return res.data;
};

const NewChatDialog = ({ open, onClose, userId }: NewChatDialogProps) => {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
  };

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['servers', userId] });
      await queryClient.invalidateQueries({ queryKey: ['serverChatRooms', userId] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPostMutation.mutate({
      name,
      userId,
    });
    onClose();
    setName('');
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
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: theme.palette.secondary.main,
            }}
          >
            <Typography variant="h5" gutterBottom color="white">
              Server Creation
            </Typography>

            <TextField
              fullWidth
              label="Enter server name..."
              name="name"
              margin="normal"
              value={name}
              onChange={handleChange}
              sx={{
                '& label': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Submit
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
