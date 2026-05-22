import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import {
  Search,
  Filter,
  Calendar,
  BarChart2,
  TrendingDown,
  RefreshCw,
} from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { useStatsStore } from '../store/useStatsStore';
import { KPICard } from '../components/stats/KPICard';
import { DefectChart } from '../components/stats/DefectChart';
import { ProductionLogTable } from '../components/stats/ProductionLogTable';
import { Badge } from '../components/ui/Badge';
import {
  MOCK_KPI_DATA,
  MOCK_LINE_CHART_DATA,
  MOCK_DEFECT_DISTRIBUTION,
} from '../mock/statistics';
import { MOCK_PRODUCTION_LOGS } from '../mock/detections';
import { CHART_CONFIG } from '../constants/config';

const { width: SW } = Dimensions.get('window');

const DATE_RANGES = ['7d', '30d', '90d'] as const;
type DateRange = (typeof DATE_RANGES)[number];

const DefectBarEntry = ({ name, count, total, color }: { name: string; count: number; total: number; color: string }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={barStyles.row}>
      <View style={barStyles.labelWrap}>
        <View style={[barStyles.dot, { backgroundColor: color }]} />
        <Text style={barStyles.name} numberOfLines={1}>{name}</Text>
        <Text style={[barStyles.count, { color }]}>{count}</Text>
      </View>
      <View style={barStyles.track}>
        <View style={[barStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const barStyles = StyleSheet.create({
  row: { marginBottom: 10 },
  labelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { flex: 1, fontSize: 12, color: Colors.textSecondary },
  count: { fontSize: 12, fontWeight: '700' },
  track: { height: 6, backgroundColor: Colors.bgSurface, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});

export default function StatisticsScreen() {
  const { dateRange, searchQuery, setDateRange, setSearchQuery, isLoading, refreshData } = useStatsStore();
  const [activeRange, setActiveRange] = useState<DateRange>('7d');

  const handleRangeChange = (r: DateRange) => {
    setActiveRange(r);
    setDateRange(r);
    refreshData();
  };

  const filteredLogs = MOCK_PRODUCTION_LOGS.filter(
    (l) =>
      searchQuery === '' ||
      l.pcbId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDefects = MOCK_DEFECT_DISTRIBUTION.reduce((s, d) => s + d.count, 0);

  const defectBarData = MOCK_DEFECT_DISTRIBUTION.map((d) => ({
    name: d.name,
    count: d.count,
    total: totalDefects,
    color: d.color,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgSurface} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Analytics & Reports</Text>
            <Text style={styles.screenSub}>Production performance overview</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={refreshData} activeOpacity={0.7}>
            <RefreshCw size={16} color={isLoading ? Colors.accent : Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Date range filter */}
        <View style={styles.filterRow}>
          <View style={styles.dateRangePicker}>
            {DATE_RANGES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.rangeBtn, activeRange === r && styles.rangeBtnActive]}
                onPress={() => handleRangeChange(r)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rangeBtnText, activeRange === r && styles.rangeBtnTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.filterIconBtn}>
            <Calendar size={16} color={Colors.textSecondary} />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Search size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search PCB ID or status…"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* KPI Cards grid */}
        <View style={styles.kpiGrid}>
          {MOCK_KPI_DATA.map((kpi) => (
            <KPICard key={kpi.label} data={kpi} />
          ))}
        </View>

        {/* Daily Detections Line Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>DAILY DEFECT TREND</Text>
            <Badge label="7-DAY" color={Colors.accent} size="sm" />
          </View>
          <LineChart
            data={MOCK_LINE_CHART_DATA}
            width={SW - 32}
            height={180}
            chartConfig={CHART_CONFIG}
            bezier
            style={styles.lineChart}
            withShadow={false}
          />
        </View>

        {/* Defect Distribution Bars */}
        <View style={styles.sectionCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>DEFECT DISTRIBUTION</Text>
            <Text style={styles.totalCount}>{totalDefects} total</Text>
          </View>
          {defectBarData.map((d) => (
            <DefectBarEntry key={d.name} {...d} />
          ))}
        </View>

        {/* Bar chart by defect class */}
        <DefectChart
          title="Defect Frequency by Type"
          data={MOCK_DEFECT_DISTRIBUTION.map((d) => ({ label: d.name, value: d.count, color: d.color }))}
        />

        {/* Production Summary */}
        <View style={[styles.sectionCard, { marginTop: 12 }]}>
          <Text style={styles.chartTitle}>WEEKLY SUMMARY</Text>
          <View style={styles.summaryGrid}>
            <SummaryItem label="PCBs Inspected" value="2,030" color={Colors.accent} />
            <SummaryItem label="Defective PCBs" value="254" color={Colors.danger} />
            <SummaryItem label="Avg. Defect Rate" value="12.5%" color={Colors.warning} />
            <SummaryItem label="AI Accuracy" value="96.4%" color={Colors.success} />
          </View>
        </View>

        {/* Production Logs */}
        <View style={styles.logSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>PRODUCTION LOGS</Text>
            <Badge label={`${filteredLogs.length} entries`} color={Colors.textSecondary} size="sm" />
          </View>
          <ProductionLogTable logs={filteredLogs} />
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const SummaryItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={styles.summaryItem}>
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  header: {
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  screenTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  screenSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  dateRangePicker: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    flex: 1,
  },
  rangeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  rangeBtnActive: { backgroundColor: Colors.accent },
  rangeBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  rangeBtnTextActive: { color: '#fff', fontWeight: '800' },
  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    height: 38,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  scroll: { flex: 1 },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
    paddingBottom: 0,
  },
  chartSection: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  totalCount: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  lineChart: { borderRadius: 12, marginLeft: -16 },
  sectionCard: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  summaryItem: { width: '47%', alignItems: 'center', paddingVertical: 10 },
  summaryValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  summaryLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', fontWeight: '500' },
  logSection: { margin: 16, marginBottom: 0, gap: 10 },
  bottomPad: { height: 32 },
});
