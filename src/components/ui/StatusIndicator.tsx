import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

type Status = 'online' | 'offline' | 'warning' | 'processing';

interface StatusIndicatorProps {
  status: Status;
  label: string;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<Status, string> = {
  online: Colors.success,
  offline: Colors.textMuted,
  warning: Colors.warning,
  processing: Colors.accent,
};

export const StatusIndicator = ({ status, label, size = 'md' }: StatusIndicatorProps) => {
  const opacity = useSharedValue(1);
  const color = STATUS_COLORS[status];
  const isAnimated = status === 'online' || status === 'processing';

  useEffect(() => {
    if (isAnimated) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 700 }),
          withTiming(1, { duration: 700 })
        ),
        -1,
        false
      );
    } else {
      opacity.value = 1;
    }
  }, [status, isAnimated, opacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const dotSize = size === 'sm' ? 7 : 9;
  const fontSize = size === 'sm' ? 10 : 11;

  return (
    <View style={styles.row}>
      <View style={[styles.dotOuter, { width: dotSize + 6, height: dotSize + 6, borderRadius: (dotSize + 6) / 2, backgroundColor: `${color}22` }]}>
        <Animated.View
          style={[dotStyle, styles.dot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color }]}
        />
      </View>
      <Text style={[styles.label, { fontSize, color: STATUS_COLORS[status] }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dotOuter: { justifyContent: 'center', alignItems: 'center' },
  dot: {},
  label: { fontWeight: '600', letterSpacing: 0.5 },
});
