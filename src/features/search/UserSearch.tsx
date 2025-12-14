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

interface User {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface UserSearchProps {
    data: User[];
    onUserSelect: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ data, onUserSelect }) => {
    return (
        <Autocomplete
            options={data}
            getOptionLabel={(option) => option.name}
            sx={{
                width: "100%",
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
                if (value) onUserSelect(value);
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
                        endAdornment: params.InputProps.endAdornment,
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
