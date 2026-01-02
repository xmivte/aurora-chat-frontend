import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import { backdropStyles, paperStyles, closeButtonStyles } from './NewChatDialog.ts';
import UserSearch from './UserSearch.tsx';
import { User } from './UserType';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onUserSelect: (user: User) => void;
}

const NewChatDialog = ({ open, onClose, onUserSelect }: NewChatDialogProps) => {
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
        <UserSearch
          data={[
            { id: '1', username: 'Alice Johnson', image: 'https://i.pravatar.cc/150?img=1' },
            { id: '2', username: 'Bob Smith', image: 'https://i.pravatar.cc/150?img=2' },
            { id: '3', username: 'Charlie Brown', image: 'https://i.pravatar.cc/150?img=3' },
            { id: '4', username: 'Diana Prince', image: '' },
          ]}
          onUserSelect={onUserSelect}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
