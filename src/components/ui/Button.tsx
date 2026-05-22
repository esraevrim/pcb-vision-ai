import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedPress } from '../../hooks/useAnimatedPress';
import { Colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_STYLES = {
  primary: { bg: Colors.accent, border: Colors.accent, text: '#fff' },
  danger: { bg: Colors.danger, border: Colors.danger, text: '#fff' },
  outline: { bg: 'transparent', border: Colors.accent, text: Colors.accent },
  ghost: { bg: 'transparent', border: 'transparent', text: Colors.textSecondary },
};

const SIZE_STYLES = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14 },
  lg: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 16 },
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  size = 'md',
}: ButtonProps) => {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress();
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.button,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={v.text} />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
