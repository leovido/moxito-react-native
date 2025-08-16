export const colors = {
  primary: {
    10: '#A87AFF1A',
    25: '#A87AFF40',
    100: '#A87AFF',
  },
  white: {
    10: '#FFFFFF1A',
    50: '#FFFFFF40',
    80: '#FFFFFF80',
    100: '#FFFFFF',
  },
  black: {
    4: '#383737',
    8: '#3837371A',
    16: '#3837372E',
    100: '#383737',
  },
  red: {
    10: '#DA24271A',
    25: '#DA242740',
    100: '#DA2427',
  },
  // Semantic colors
  success: '#',
  warning: '#',
  error: '#',
  info: '#',
  // Adding gradients
  gradients: {
    moxiePurple: 'linear-gradient(135deg, #A87AFF 0%, #BC99FF 100%)',
    moxieBlack: 'linear-gradient(45deg, #1D1D1D 0%, #3D3D3D 100%)',
  },
} as const;

export type ColorKeys = keyof typeof colors;
