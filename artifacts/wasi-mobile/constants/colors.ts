const PRIMARY = "#1E7E8C";
const PRIMARY_DARK = "#155F6B";
const PRIMARY_LIGHT = "#2FA8B8";
const ACCENT = "#C07850";
const ACCENT_LIGHT = "#D4946A";
const DARK_BG = "#0D2830";
const SIDEBAR_BG = "#112D38";

export const Colors = {
  primary: PRIMARY,
  primaryDark: PRIMARY_DARK,
  primaryLight: PRIMARY_LIGHT,
  accent: ACCENT,
  accentLight: ACCENT_LIGHT,

  light: {
    background: "#F5F7F8",
    surface: "#FFFFFF",
    surfaceSecondary: "#EEF2F4",
    text: "#0D2830",
    textSecondary: "#4A6572",
    textMuted: "#8FA4AE",
    border: "#D4DDE1",
    tint: PRIMARY,
    tabIconDefault: "#8FA4AE",
    tabIconSelected: PRIMARY,
    card: "#FFFFFF",
    danger: "#D64545",
    success: "#2E9E6B",
    warning: "#E8A020",
  },
  dark: {
    background: DARK_BG,
    surface: SIDEBAR_BG,
    surfaceSecondary: "#1A3D4D",
    text: "#F0F6F8",
    textSecondary: "#9BB8C2",
    textMuted: "#5C7E8A",
    border: "#234050",
    tint: PRIMARY_LIGHT,
    tabIconDefault: "#5C7E8A",
    tabIconSelected: PRIMARY_LIGHT,
    card: SIDEBAR_BG,
    danger: "#E05555",
    success: "#3AB87C",
    warning: "#F0AC30",
  },
};

export default Colors;
