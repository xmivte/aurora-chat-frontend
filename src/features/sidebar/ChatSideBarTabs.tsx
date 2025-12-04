import { Tabs, Box, SxProps, Theme } from '@mui/material';
import { useState } from 'react';

import ChatSideBarTab from './ChatSideBarTab';
import { type TabsComponentProps } from './types';

const BoxStyling: SxProps<Theme> = {
  width: '100%',
  bgcolor: 'rgb(38, 33, 61)',
  borderRadius: 2,
};

const ChatSidebarTabs = ({ items }: TabsComponentProps) => {
  const [currentTab, setCurrentTab] = useState<string>(items[0]);

  return (
    <Box sx={BoxStyling}>
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
