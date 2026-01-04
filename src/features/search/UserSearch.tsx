import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  TextField,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import { useState } from 'react';

import avatar from '../../assets/firstUser.svg';

import {
  autocompletePaperStyles,
  autocompleteRootStyles,
  searchIconStyles,
  clearIconStyles,
  textFieldStyles,
} from './UserSearch.ts';

import { User } from '../chat/index.ts';

interface UserSearchProps {
  data: User[];
  onUserSelect: (user: User) => void;
}

const UserSearch = ({ data, onUserSelect }: UserSearchProps) => {
  const [inputValue, setInputValue] = useState('');
  return (
    <Autocomplete
      options={[...data].sort((a, b) => a.username.localeCompare(b.username))}
      getOptionLabel={option => option.username}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      forcePopupIcon={false}
      popupIcon={null}
      clearIcon={null}
      noOptionsText="Hmm, can't find anyone by that name..."
      slotProps={{
        paper: autocompletePaperStyles,
      }}
      sx={autocompleteRootStyles}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <ListItem disableGutters sx={{}} component="div">
            <ListItemAvatar>
              <Avatar src={option.image || avatar} alt={option.username} sx={{}}>
                {option.username.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={option.username} sx={{}} />
          </ListItem>
        </li>
      )}
      onChange={(_, value) => {
        if (value) {
          onUserSelect(value);
          setInputValue('');
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Start typing a name..."
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={searchIconStyles} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {inputValue.length > 0 && (
                    <CloseIcon onClick={() => setInputValue('')} style={clearIconStyles} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
          sx={textFieldStyles}
        />
      )}
    />
  );
};

export default UserSearch;
