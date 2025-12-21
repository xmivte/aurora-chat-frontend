import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import UserSearch from "./UserSearch";
import { User } from "./UserType";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { backdropStyles, paperStyles, closeButtonStyles } from "./NewChatDialog";

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
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={closeButtonStyles}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent>
                <UserSearch data={[
                    { id: "1", name: "Alice Johnson", avatarUrl: "https://i.pravatar.cc/150?img=1" },
                    { id: "2", name: "Bob Smith", avatarUrl: "https://i.pravatar.cc/150?img=2" },
                    { id: "3", name: "Charlie Brown", avatarUrl: "https://i.pravatar.cc/150?img=3" },
                    { id: "4", name: "Diana Prince", avatarUrl: "" },
                ]} onUserSelect={onUserSelect} />
            </DialogContent>
        </Dialog>
    );
};

export default NewChatDialog;
