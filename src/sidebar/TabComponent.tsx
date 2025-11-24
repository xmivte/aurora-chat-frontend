import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

type TabProps = {
    value: string
    key: number
}

export type TabsComponentProps = {
    items: string[]
};

const BoxStyling = { 
    width: '100%', 
    bgcolor: 'rgb(38, 33, 61)', 
    borderRadius: 2 
};

const TabStyling = {
    flexGrow: 1, 
    textTransform: 'none',
    minHeight: 0,
    bgcolor: 'rgb(35, 31, 57)',
    borderRadius: '8px 0 0 8px',
    border: '0px',
    color: 'grey',
    outline: 'none !important'
};

const ActiveTabStyling = {
    color: 'white',
    bgcolor: 'rgb(51, 45, 80)',
    outline: 'none',
    boxShadow: 'none',
};

const ChatSidebarTabs = ({items}: TabsComponentProps) => {
    const [value, setValue] = useState<string>(items[0]);

    return (
        <Box sx={BoxStyling}>
            <Tabs 
                value={value} 
                onChange={(_, newValue) => setValue(newValue as string)} 
                visibleScrollbar={false}>
                    {items.map((tabsName, i) => {
                        return <ChatSideBarTab key={i} value={tabsName} />;
                    })}
            </Tabs>
        </Box>
    );
};

const ChatSideBarTab= ({value, key, ...props}: TabProps) => {
    return (
        <Tab
            {...props}
            key={key}
            value={value} 
            label={value}
            sx={{
                ...TabStyling,
                '&.Mui-selected': {
                    ...ActiveTabStyling,
                }}
            }/>
    );
};

export default ChatSidebarTabs;