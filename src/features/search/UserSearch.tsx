import React from "react";
import {
    Autocomplete,
    TextField,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    InputAdornment,
} from "@mui/material";
import avatar from "../chat/assets/avatar.png";
import SearchIcon from "@mui/icons-material/Search";
import { User } from "./UserType";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import {
    autocompletePaperStyles,
    autocompleteRootStyles,
    searchIconStyles,
    clearIconStyles,
    textFieldStyles,
} from "./UserSearch.ts";

interface UserSearchProps {
    data: User[];
    onUserSelect: (user: User) => void;
}

const UserSearch = ({ data, onUserSelect }: UserSearchProps) => {

    const [inputValue, setInputValue] = useState("");
    return (
        <Autocomplete
            options={data}
            getOptionLabel={(option) => option.name}
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
                    <ListItem
                        disableGutters
                        sx={{}}
                    >
                        <ListItemAvatar>
                            <Avatar
                                src={option.avatarUrl || avatar}
                                alt={option.name}
                                sx={{
                                }}
                            >
                                {option.name.charAt(0)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={option.name}
                            sx={{}}
                        />
                    </ListItem>
                </li>
            )}
            onChange={(_, value) => {
                if (value) {
                    onUserSelect(value);
                    setInputValue("");
                }
            }}
            renderInput={(params) => (
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
                                        <CloseIcon
                                            onClick={() => setInputValue("")}
                                            style={clearIconStyles}
                                        />
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
