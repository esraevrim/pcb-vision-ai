// Port of _refresh_pie_chart() from DashboardWidget
// Defect type distribution — mirrors get_defect_type_distribution() query
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/colors';
import type { DefectTypeCount } from '../../types/database';

const { width: SW } = Dimensions.get('window');

// Color palette from dashboard_widget.py PIE_COLORS — adapted to dark theme
const PIE_COLORS = [
  Colors.danger,     // Short Circuit — red
  Colors.accent,     // Missing Hole  — blue
  Colors.warning,    // Spur          — amber
  Colors.success,    // Mouse Bite    — green
  Colors.purple,     // Spurious Copper — purple
  Colors.cyan,       // Open Circuit  — cyan
];

interface DefectPieChartProps {
  distribution: DefectTypeCount[];
}

export const DefectPieChart = ({ distribution }: DefectPieChartProps) => {
  if (distribution.length === 0) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>No defect data available</Text>
      </View>
    );
  }

  const pieData = distribution.map((item, i) => ({
    name: item.defectType,
    population: item.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
    legendFontColor: Colors.textSecondary,
    legendFontSize: 11,
  }));

  const total = distribution.reduce((s, d) => s + d.count, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DEFECT TYPE DISTRIBUTION</Text>

      <PieChart
        data={pieData}
        width={SW - 64}
        height={180}
        chartConfig={{
          backgroundGradientFrom: Colors.bgCard,
          backgroundGradientTo: Colors.bgCard,
          color: () => Colors.accent,
          labelColor: () => Colors.textSecondary,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="12"
        absolute={false}
        style={styles.chart}
      />

      {/* Custom breakdown bar — mirrors the horizontal bar in Python */}
      <View style={styles.breakdown}>
        {distribution.map((item, i) => {
          const color = PIE_COLORS[i % PIE_COLORS.length];
          const pct = total > 0 ? (item.count / total) * 100 : 0;
          return (
            <View key={item.defectType} style={styles.barRow}>
              <View style={styles.barLabel}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <Text style={styles.barName} numberOfLines={1}>{item.defectType}</Text>
                <Text style={[styles.barCount, { color }]}>{item.count}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]}
                />
              </View>
            </View>
          );
        })}
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
  empty: { alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  emptyText: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chart: { marginLeft: -12 },
  breakdown: { marginTop: 8, gap: 7 },
  barRow: {},
  barLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  barName: { flex: 1, fontSize: 11, color: Colors.textSecondary },
  barCount: { fontSize: 11, fontWeight: '700', minWidth: 24, textAlign: 'right' },
  barTrack: { height: 5, backgroundColor: Colors.bgSurface, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
});
