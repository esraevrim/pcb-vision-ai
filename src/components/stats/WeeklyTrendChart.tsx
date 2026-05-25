// Port of _refresh_line_chart() from DashboardWidget
// Shows 4-week scanned vs faulty trend — matches Python weekly stats query
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/colors';
import type { WeeklyStats } from '../../types/database';

const { width: SW } = Dimensions.get('window');

interface WeeklyTrendChartProps {
  weeklySeries: WeeklyStats[];
}

export const WeeklyTrendChart = ({ weeklySeries }: WeeklyTrendChartProps) => {
  const labels = weeklySeries.map((_, i) => `W${i + 1}`);
  const scanned = weeklySeries.map((w) => w.totalScanned);
  const faulty  = weeklySeries.map((w) => w.totalFaulty);

  const data = {
    labels,
    datasets: [
      {
        data: scanned,
        color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: faulty,
        color: (opacity = 1) => `rgba(255, 23, 68, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Scanned', 'Faulty'],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WEEKLY TREND — SCANNED VS FAULTY (4 WEEKS)</Text>
      <LineChart
        data={data}
        width={SW - 64}
        height={170}
        chartConfig={{
          backgroundGradientFrom: Colors.bgCard,
          backgroundGradientTo: Colors.bgCard,
          color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
          labelColor: () => Colors.textSecondary,
          strokeWidth: 2,
          decimalPlaces: 0,
          propsForDots: { r: '4', strokeWidth: '2' },
          propsForBackgroundLines: { stroke: Colors.border, strokeDasharray: '4' },
        }}
        bezier
        withShadow={false}
        style={styles.chart}
      />
      {/* Legend — mirrors the ax.legend() call in Python */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
          <Text style={styles.legendLabel}>Scanned</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
          <Text style={styles.legendLabel}>Faulty</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chart: { borderRadius: 12, marginLeft: -16 },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
});
