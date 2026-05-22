export const APP_CONFIG = {
  appName: 'PCB Vision AI',
  appVersion: '2.1.4',
  modelName: 'YOLOv12-PCB',
  modelVersion: 'v12.3.1',
  targetFPS: 30,
  confidenceThreshold: 0.45,
  productionLine: 'LINE-A1',
  facility: 'Facility Block-3',
} as const;

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 350,
  slow: 600,
  pulse: 1500,
} as const;

export const CHART_CONFIG = {
  backgroundGradientFrom: '#0D1526',
  backgroundGradientTo: '#0D1526',
  color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 140, 174, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#00A8FF',
  },
  propsForBackgroundLines: {
    stroke: '#1E3A5F',
    strokeDasharray: '4',
  },
} as const;
