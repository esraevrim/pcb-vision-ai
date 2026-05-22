import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  glowColor?: string;
  padding?: number;
}

export const Card = ({ children, style, glow = false, glowColor = Colors.accent, padding = 16 }: CardProps) => (
  <View
    style={[
      styles.card,
      glow && { shadowColor: glowColor, shadowOpacity: 0.25, shadowRadius: 16, elevation: 12 },
      { padding },
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
