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
            noOptionsText = "Hmm, can't find anyone by that name..."
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "#1e1e2f", // dropdown background
                        borderRadius: "12px",
                        border: "1px solid grey",


                        "& .MuiAutocomplete-option": {
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#333a55", // hover
                            },

                        },

                        "& .MuiAutocomplete-noOptions": {
                                color: "#fff",
                            },
                    },
                },
            }}
            sx={{
                width: "99%",
            }}
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
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#aaa", mr: 1 }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {inputValue.length > 0 && (
                                    <CloseIcon
                                        onClick={() => setInputValue("")}
                                        style={{ cursor: "pointer", color: "#fff" }}
                                    />
                                )}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        backgroundColor: "transparent",
                        "& .MuiInputBase-root": {
                            backgroundColor: "#292641",
                            borderRadius: "20px",
                            overflow: "hidden",
                        },
                        "& .MuiOutlinedInput-root": {
                            "& legend": { display: "none" },
                            "& fieldset": { top: 0 },
                        },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                        "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
                        "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
                        "& .MuiInputBase-input": {
                            color: "#fff",
                            height: "20px",
                            padding: "0 12px",
                        },
                        "& .MuiAutocomplete-clearIndicator svg": {
                            color: "#fff",
                        },


                    }}
                />
            )}
        />
    );
};

export default UserSearch;
