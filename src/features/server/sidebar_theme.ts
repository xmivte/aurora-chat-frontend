export type ThemeColors = {
  gradientStart: string;
  gradientMiddle?: string;
  gradientEnd: string;
  sidebarOverlay?: string;
  accent: string;
  avatarBg: string;
  divider: string;
  mutedText: string;
};

export const DEFAULT_THEME: ThemeColors = {
  gradientStart: '#1a133b',
  gradientMiddle: '#2e1642',
  gradientEnd: '#451e42',
  sidebarOverlay: '#0000008C',
  accent: '#ff63c9',
  avatarBg: '#121222',
  divider: '#FFFFFF0F',
  mutedText: '#B6B3C7',
};
