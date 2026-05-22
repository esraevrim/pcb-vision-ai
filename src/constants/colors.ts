export const Colors = {
  // Backgrounds
  bgDeep: '#060B14',
  bgSurface: '#0D1526',
  bgCard: '#111F3A',
  bgCardHover: '#162544',

  // Borders
  border: '#1E3A5F',
  borderBright: '#2A5080',

  // Accent — Electric Blue
  accent: '#00A8FF',
  accentDim: '#0066CC',
  accentGlow: 'rgba(0, 168, 255, 0.15)',

  // Semantic
  success: '#00E676',
  successDim: 'rgba(0, 230, 118, 0.15)',
  danger: '#FF1744',
  dangerDim: 'rgba(255, 23, 68, 0.15)',
  warning: '#FF9100',
  warningDim: 'rgba(255, 145, 0, 0.15)',
  purple: '#9B59B6',
  purpleDim: 'rgba(155, 89, 182, 0.15)',
  cyan: '#00E5FF',

  // Text
  textPrimary: '#E8F4FF',
  textSecondary: '#6B8CAE',
  textMuted: '#3A5A7A',

  // Chart colors
  chartBlue: '#00A8FF',
  chartGreen: '#00E676',
  chartRed: '#FF1744',
  chartOrange: '#FF9100',
  chartPurple: '#9B59B6',
  chartCyan: '#00E5FF',
} as const;

export const DefectColors: Record<string, string> = {
  'Missing Hole': Colors.danger,
  'Mouse Bite': Colors.warning,
  'Spur': Colors.cyan,
  'Short Circuit': Colors.danger,
  'Open Circuit': Colors.warning,
  'Spurious Copper': Colors.purple,
};

export const DefectBgColors: Record<string, string> = {
  'Missing Hole': Colors.dangerDim,
  'Mouse Bite': Colors.warningDim,
  'Spur': 'rgba(0, 229, 255, 0.15)',
  'Short Circuit': Colors.dangerDim,
  'Open Circuit': Colors.warningDim,
  'Spurious Copper': Colors.purpleDim,
};
