import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import UserSearch from "./UserSearch";
import { User } from "./UserType";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
            BackdropProps={{
                sx: { backdropFilter: "blur(5px)" },
            }}
            PaperProps={{
                sx: {
                    marginTop: "15vh",   // move dialog up
                    alignSelf: "flex-start", backgroundColor: "#121222", borderRadius: "12px", border: "1px solid grey",
                    position: "relative",
                },
            }}
        >

            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    color: "#aaa",
                }}
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
