export const tabStyles = {
  flexGrow: 1,
  textTransform: 'none',
  minHeight: 0,
  bgcolor: 'rgb(26,25,45)',
  borderRadius: '20px',
  border: '0px',
  color: '#F8F9FB',
  outline: 'none !important',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
  },
  '&:hover': {
    bgcolor: 'rgb(72,69,104)',             
    cursor: 'pointer',          
  },
};

export const activeTabStyles = {
  color: 'white',
  bgcolor: 'rgb(42,39,74)',
  outline: 'none',
  boxShadow: 'none',
};

export const boxStyles = {
  width: '100%',
  bgcolor: '#1A192D',
  borderRadius: 2,
};