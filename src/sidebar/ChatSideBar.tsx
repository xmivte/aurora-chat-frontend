import { Paper, List } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import TabsComponent from './TabComponent';
import UserProfileComponent from './UserProfileComponent';

export type MembersInfo = {
    url: string;
    online: boolean;
    username: string;
}

export type SideBarProps = {
    members: MembersInfo[]
}

const PaperStyling = {
    'backgroundColor': 'rgb(38, 33, 61)',
    padding: '2px',
    width: '300px',
    color: 'white',
};

const ListTextStyling = {
    padding: '20px',
};

const ChatSideBar = ({ members }: SideBarProps) =>  {
    const tabs = ['Info', 'Media'];

    return (
        <Paper sx={PaperStyling}>
            <TabsComponent items={tabs}/>
            <ListItemText sx={ListTextStyling} primary="Group Info"/>

            <List>
                {members.map((member, i) => {
                    return <UserProfileComponent key={i} {...member}/>;
                })}
            </List>
        </Paper>
    );
};

export default ChatSideBar;