import { Tab } from '@mui/material';

import { tabStyles, activeTabStyles } from './ChatSideBarTabs.ts';
import { type TabProps } from './types';

const ChatSideBarTab = ({ value, key, ...props }: TabProps) => {
  return (
    <Tab
      {...props}
      key={key}
      value={value}
      label={value}
      sx={{
        ...tabStyles,
        '&.Mui-selected': {
          ...activeTabStyles,
        },
      }}
    />
  );
};

export default ChatSideBarTab;
