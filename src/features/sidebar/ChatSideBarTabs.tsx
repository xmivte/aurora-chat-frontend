import { Tabs, Box } from '@mui/material';
import { useState } from 'react';
import ChatSideBarTab from './ChatSideBarTab';
import { type TabsComponentProps } from './types';
import { boxStyles } from './ChatSideBarTabs.ts';


const ChatSidebarTabs = ({ items }: TabsComponentProps) => {
  const [currentTab, setCurrentTab] = useState<string>(items[0]);

  return (
    <Box sx={boxStyles}>
      <Tabs
        value={currentTab}
        onChange={(_, newValue: string) => setCurrentTab(newValue)}
        visibleScrollbar={false}
      >
        {items.map((tabsName, i) => {
          return <ChatSideBarTab key={i} value={tabsName} />;
        })}
      </Tabs>
    </Box>
  );
};

export default ChatSidebarTabs;
