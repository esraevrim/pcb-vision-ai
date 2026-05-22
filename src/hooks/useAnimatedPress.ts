import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const useAnimatedPress = (scaleTo = 0.95) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.85, { duration: 100 });
  }, [scale, opacity, scaleTo]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 250 });
    opacity.value = withTiming(1, { duration: 150 });
  }, [scale, opacity]);

  return { animatedStyle, onPressIn, onPressOut };
};
