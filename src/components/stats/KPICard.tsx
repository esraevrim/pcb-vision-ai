import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import type { KPIData } from '../../types';

interface KPICardProps {
  data: KPIData;
}

export const KPICard = ({ data }: KPICardProps) => {
  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';
  const trendColor = isUp ? Colors.success : isDown ? Colors.danger : Colors.textSecondary;
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  const changePrefix = data.change > 0 ? '+' : '';

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{data.label}</Text>
      <Text style={styles.value}>{data.value}{data.unit}</Text>

      <View style={styles.trend}>
        <TrendIcon size={12} color={trendColor} />
        <Text style={[styles.change, { color: trendColor }]}>
          {changePrefix}{data.change}%
        </Text>
        <Text style={styles.period}>vs last wk</Text>
      </View>
    </View>
  );
};

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
  label: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  change: { fontSize: 11, fontWeight: '700' },
  period: { fontSize: 10, color: Colors.textMuted },
});
