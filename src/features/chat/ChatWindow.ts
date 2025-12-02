export const outerBoxSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: '#121222',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0px 4px 8px #13121C',
  overflow: 'hidden',
};

export const messagesSx = {
  flex: 1,              
  minHeight: 0,        
  overflowY: 'auto',    
  scrollbarWidth: 'thin',
  scrollbarColor: '#444 #121222',
  '&::-webkit-scrollbar': { width: '8px' },
  '&::-webkit-scrollbar-track': { background: '#121222', borderRadius: '12px' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: '#444', borderRadius: '12px' },
};

export const inputSx = {
  flexShrink: 0,  
  marginTop: '15px',     
  backgroundColor: '#292641',
  borderRadius: '20px',
  width: '100%',
  boxShadow: '0px 4px 8px #13121C',
  '& .MuiInputBase-input': {
    color: '#F8F9FB',
    fontSize: '14px',
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
};

export const sendButtonSx = {
  '&:focus': {
    border: 'none',
  },
};