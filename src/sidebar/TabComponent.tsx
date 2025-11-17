import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

type TabProps = {
    value: string
    key: number
}

export type TabsComponentProps = {
    items: string[]
}

function TabsComponent({items}: TabsComponentProps) {
    const [value, setValue] = useState<string>('Info');
    const TABS_BG_COLOR = 'rgb(38, 33, 61)';

    return (
        <Box sx={{ width: '100%', bgcolor: TABS_BG_COLOR, borderRadius: 2 }}>
            <Tabs 
                value={value} 
                onChange={(_, newValue) => setValue(newValue)} 
                visibleScrollbar={false}>
                    {items.map((tabsName, i) => {
                        return <TabComponent key={i} value={tabsName} />
                    })}
            </Tabs>
        </Box>
    )
}

function TabComponent({value, key, ...props}: TabProps){
    const ACTIVE_TAB_COLOR = 'rgb(51, 45, 80)';
    const INACTIVE_TAB_COLOR = 'rgb(35, 31, 57)';
    return (
        <Tab 
            {...props}
            key={key}
            value={value} 
            label={value}
            sx={{ 
                flexGrow: 1, 
                textTransform: 'none',
                minHeight: 0,
                bgcolor: INACTIVE_TAB_COLOR,
                borderRadius: '8px 0 0 8px',
                color: 'white',
                '&.Mui-selected': { 
                    color: 'white',
                    bgcolor: ACTIVE_TAB_COLOR
                }
            }}/>
    )
}

export default TabsComponent;