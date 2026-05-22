import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  dot?: boolean;
  animated?: boolean;
}

export const Badge = ({
  label,
  color = '#00A8FF',
  bgColor,
  size = 'md',
  style,
  dot = false,
}: BadgeProps) => {
  const bg = bgColor ?? `${color}22`;
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: `${color}55` }, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text
        style={[
          styles.label,
          { color, fontSize: isSmall ? 9 : 11 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
