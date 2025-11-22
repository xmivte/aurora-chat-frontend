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
  gradientStart: '#1b1228',
  gradientMiddle: '#2e1642',
  gradientEnd: '#7b2f7b',
  sidebarOverlay: 'rgba(0,0,0,0.55)',
  accent: '#ff63c9',
  avatarBg: '#2b1b3a',
  divider: 'rgba(255,255,255,0.06)',
  mutedText: '#80848e',
};
