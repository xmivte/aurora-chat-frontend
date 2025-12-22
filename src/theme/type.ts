declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      colorText: string;
      colorBlueDark: string;
      colorBlueLight: string;
      colorBlueLightHover: string;
      colorPurple: string;
      colorPink: string;
      colorPurpleLight: string;
      colorPinkLight: string;
      colorMyMessage: string;
      colorOtherMessage: string;
      colorOnline: string;
      colorBusy: string;
      colorInactive: string;
      btnLogout: string;
      colorMainShadow: string;
      colorGray: string;
      colorGradientStart: string;
      colorGradientMiddle: string;
      colorGradientEnd: string;
      colorSidebarOverlay: string;
      colorMutedText: string;
    };
    customShape: {
      roundedContainer: string;
      roundedArea: string;
      roundedBtn: string;
      roundedAvatar: string;
    };
  }
  interface ThemeOptions {
    customColors?: Partial<Theme['customColors']>;
    customShape?: Partial<Theme['customShape']>;
  }
}
