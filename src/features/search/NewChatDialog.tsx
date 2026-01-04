import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import UserSearch from "./UserSearch.tsx";
import { User } from '../chat/index.ts';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { backdropStyles, paperStyles, closeButtonStyles } from "./NewChatDialog.ts";

interface NewChatDialogProps {
    open: boolean;
    onClose: () => void;
    onUserSelect: (user: User) => void;
    allUsers: User[];
}

const NewChatDialog = ({ open, onClose, onUserSelect, allUsers }: NewChatDialogProps) => {
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
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={closeButtonStyles}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent>
                <UserSearch
                    data={allUsers}
                    onUserSelect={onUserSelect} />
            </DialogContent>
        </Dialog>
    );
};

export default NewChatDialog;
