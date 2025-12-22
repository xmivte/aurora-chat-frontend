import theme from "../../theme/theme";

export const backdropStyles = {
    sx: { backdropFilter: "blur(5px)" },
};

export const paperStyles = {
    sx: {
        marginTop: "15vh",
        alignSelf: "flex-start",
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.customShape.roundedContainer,
        position: "relative",
    },
};

export const closeButtonStyles = {
    position: "absolute",
    right: 0,
    top: 0,
    color: theme.customColors.colorText,
};
