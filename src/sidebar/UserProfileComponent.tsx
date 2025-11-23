import { ListItem, Badge, ListItemAvatar, ListItemText, Avatar, BadgeProps } from "@mui/material";
import { MembersInfo } from "./ChatSideBar";

const ListItemStyling = {
    color: 'white',
    mb: 1,
}

const OnlineIndicatorPositionStyling: BadgeProps['anchorOrigin'] = { 
    vertical: 'bottom', 
    horizontal: 'right'
}

const OnlineIndicatorFormStyling = {
    width: 10,
    height: 10,
    borderRadius: '50%',
}

const ChatUsersProfile = ({username, online, url} : MembersInfo) => {
    return (
        <ListItem sx={ListItemStyling}>
            <Badge
                overlap="circular"
                anchorOrigin={OnlineIndicatorPositionStyling}
                variant="dot"
                sx={{
                    '& .MuiBadge-badge': {
                        ...OnlineIndicatorFormStyling,
                        backgroundColor: online ? 'green' : 'red',
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

export default ChatUsersProfile;