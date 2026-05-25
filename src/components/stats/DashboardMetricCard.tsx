// Port of MetricCard class from dashboard_widget.py
// Adapted to dark industrial theme — replaces PyQt6 light card style
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface DashboardMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  valueColor?: string;
  style?: ViewStyle;
}

export const DashboardMetricCard = ({
  icon,
  label,
  value,
  subtitle,
  valueColor = Colors.textPrimary,
  style,
}: DashboardMetricCardProps) => (
  <View style={[styles.card, style]}>
    <View style={styles.topRow}>
      {icon}
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </View>
    <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    {subtitle ? (
      <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    minWidth: '45%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
