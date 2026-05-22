import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/colors';
import { CHART_CONFIG } from '../../constants/config';

const { width: SW } = Dimensions.get('window');

interface DefectChartProps {
  title: string;
  data: { label: string; value: number; color: string }[];
}

export const DefectChart = ({ title, data }: DefectChartProps) => {
  const chartData = {
    labels: data.map((d) => d.label.split(' ')[0]),
    datasets: [{ data: data.map((d) => d.value) }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <BarChart
        data={chartData}
        width={SW - 48}
        height={180}
        chartConfig={{
          ...CHART_CONFIG,
          color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
          barPercentage: 0.6,
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
        withInnerLines={false}
        yAxisLabel=""
        yAxisSuffix=""
      />

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>{item.label}</Text>
            <Text style={[styles.legendValue, { color: item.color }]}>{item.value}</Text>
          </View>
        ))}
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
  title: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
  chart: { borderRadius: 12, marginLeft: -16 },
  legend: { marginTop: 12, gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { flex: 1, fontSize: 12, color: Colors.textSecondary },
  legendValue: { fontSize: 12, fontWeight: '700' },
});
