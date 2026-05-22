import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const randomBetween = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number): number =>
  Math.floor(randomBetween(min, max + 1));

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getStatusColor = (status: 'pass' | 'fail' | 'review'): string => {
  const map = { pass: '#00E676', fail: '#FF1744', review: '#FF9100' };
  return map[status];
};

export const getStatusLabel = (status: 'pass' | 'fail' | 'review'): string => {
  const map = { pass: 'PASS', fail: 'FAIL', review: 'REVIEW' };
  return map[status];
};
