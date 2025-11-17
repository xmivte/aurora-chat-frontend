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

function SideBarComponent({ members }: SideBarProps) {
    return (
        <Paper sx={{ backgroundColor: 'rgb(21, 18, 43)', p: 2, width: 300 }} elevation={3}>

            <TabsComponent items={['Info', 'Media', 'Audio']}/>

            <ListItemText
                primary="Group Info"
                sx={{ padding: '20px' }}
                slotProps={{
                    primary: {
                        sx: {
                            fontWeight: 'bold',
                            fontSize: '20px',
                            color: 'white',
                        },
                    },
                }}/>

            <List>
                {members.map((member, i) => {
                    return <UserProfileComponent key={i} {...member}/>
                })}
            </List>
        </Paper>
    );
}

export default SideBarComponent;