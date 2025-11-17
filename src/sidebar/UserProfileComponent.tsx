import { ListItem, Badge, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { MembersInfo } from "./SideBarComponent";

function UserProfileComponent({username, online, url} : MembersInfo) {
    return (
        <ListItem sx={{ color: 'white', mb: 1 }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    '& .MuiBadge-badge': {
                        backgroundColor: online ? 'green' : 'red',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                    },
                }}
            >
                <ListItemAvatar>
                    <Avatar src={url} />
                </ListItemAvatar>
            </Badge>
            <ListItemText primary={username} />
        </ListItem>
    )
}

export default UserProfileComponent;