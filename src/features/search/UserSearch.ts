import theme from "../../theme/theme";

export const autocompletePaperStyles = {
    sx: {
        backgroundColor: theme.customColors.colorMyMessage,
        borderRadius: theme.customShape.roundedContainer,

        "& .MuiAutocomplete-option": {
            color: theme.customColors.colorText,
            "&:hover": {
                backgroundColor: theme.customColors.colorBlueLightHover,
                borderRadius: theme.customShape.roundedContainer,
            },
        },

        "& .MuiAutocomplete-noOptions": {
            color: theme.customColors.colorText,
        },
    },
};

export const autocompleteRootStyles = {
    width: "99%",
};

export const searchIconStyles = {
    color: theme.customColors.colorText,
    marginRight: "8px",
};

export const clearIconStyles = {
    cursor: "pointer",
    color: theme.customColors.colorText,
};

export const textFieldStyles = {
    backgroundColor: "transparent",

    "& .MuiInputBase-root": {
        backgroundColor: theme.customColors.colorMyMessage,
        borderRadius: theme.customShape.roundedContainer,
        overflow: "hidden",
    },

    "& .MuiOutlinedInput-root": {
        "& legend": { display: "none" },
        "& fieldset": { top: 0 },
    },

    "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.customColors.colorGray,
    },

    "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.customColors.colorGray,
    },

    "& .MuiInputBase-input": {
        color: theme.customColors.colorText,
        height: "20px",
        padding: "0 12px",
    },

    "& .MuiAutocomplete-clearIndicator svg": {
        color: theme.customColors.colorText,
    },
};
