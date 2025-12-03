import { Tab, SxProps, Theme } from '@mui/material';

import { type TabProps } from './types';

const TabStyling: SxProps<Theme> = {
  flexGrow: 1,
  textTransform: 'none',
  minHeight: 0,
  bgcolor: 'rgb(35, 31, 57)',
  borderRadius: '8px 0 0 8px',
  border: '0px',
  color: 'grey',
  outline: 'none !important',
};

const ActiveTabStyling: SxProps<Theme> = {
  color: 'white',
  bgcolor: 'rgb(51, 45, 80)',
  outline: 'none',
  boxShadow: 'none',
};

const ChatSideBarTab = ({ value, key, ...props }: TabProps) => {
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
        },
      }}
    />
  );
};

export default ChatSideBarTab;
