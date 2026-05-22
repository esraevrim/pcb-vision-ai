import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimatedPress } from '../../hooks/useAnimatedPress';
import { Colors } from '../../constants/colors';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Badge } from '../ui/Badge';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  statusLabel: string;
  statusType: 'online' | 'warning' | 'offline';
  badge?: string;
  badgeColor?: string;
  onPress: () => void;
  metric?: { label: string; value: string };
}

export const NavigationCard = ({
  title,
  description,
  icon,
  accentColor,
  statusLabel,
  statusType,
  badge,
  badgeColor,
  onPress,
  metric,
}: NavigationCardProps) => {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress(0.97);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.wrapper}
      >
        <LinearGradient
          colors={[Colors.bgCard, `${accentColor}08`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: `${accentColor}30` }]}
        >
          {/* Top row: icon + badge + arrow */}
          <View style={styles.topRow}>
            <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18`, borderColor: `${accentColor}40` }]}>
              {icon}
            </View>
            <View style={styles.topRight}>
              {badge && (
                <Badge label={badge} color={badgeColor ?? accentColor} size="sm" />
              )}
              <ChevronRight size={18} color={accentColor} />
            </View>
          </View>

          {/* Title + description */}
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
          </View>

          {/* Bottom row: status + metric */}
          <View style={styles.bottomRow}>
            <StatusIndicator status={statusType} label={statusLabel} size="sm" />
            {metric && (
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: accentColor }]}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            )}
          </View>

          {/* Accent bar */}
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { borderRadius: 18 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  textBlock: { marginBottom: 14 },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  description: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metric: { alignItems: 'flex-end' },
  metricValue: { fontSize: 16, fontWeight: '800' },
  metricLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 1 },
  accentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
});
