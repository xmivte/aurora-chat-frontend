import { Tab, SxProps, Theme } from '@mui/material';
import { type TabProps } from './types';
import { tabStyles, activeTabStyles } from './ChatSideBarTabs.ts';

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
