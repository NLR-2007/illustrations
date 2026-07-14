export interface ThemeColors {
  black: string;
  white: string;
  accentYellow: string;
  lightBackground: string;
  secondaryGray: string;
  lightGray: string;
}

export const THEME_COLORS: ThemeColors = {
  black: '#111111',
  white: '#FFFFFF',
  accentYellow: '#FFC21A',
  lightBackground: '#FAFAF8',
  secondaryGray: '#666666',
  lightGray: '#E8E8E8'
};

// Return colors without hash prefix for PptxGenJS (which expects hex values without the # sign)
export function getPptxColors() {
  const stripHash = (hex: string) => hex.replace('#', '');
  return {
    black: stripHash(THEME_COLORS.black),
    white: stripHash(THEME_COLORS.white),
    accentYellow: stripHash(THEME_COLORS.accentYellow),
    lightBackground: stripHash(THEME_COLORS.lightBackground),
    secondaryGray: stripHash(THEME_COLORS.secondaryGray),
    lightGray: stripHash(THEME_COLORS.lightGray)
  };
}
