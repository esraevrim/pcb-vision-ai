// Mirrors the QComboBox range selector from DashboardWidget._build_ui()
// Options: Today / This Week / This Month
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import type { DateRange } from '../../types/database';

const OPTIONS: { label: string; value: DateRange }[] = [
  { label: 'Today',     value: 'today' },
  { label: 'This Week', value: 'week'  },
  { label: 'This Month',value: 'month' },
];

interface RangeSelectorProps {
  selected: DateRange;
  onChange: (range: DateRange) => void;
}

export const RangeSelector = ({ selected, onChange }: RangeSelectorProps) => (
  <View style={styles.container}>
    {OPTIONS.map((opt) => {
      const active = opt.value === selected;
      return (
        <TouchableOpacity
          key={opt.value}
          style={[styles.btn, active && styles.btnActive]}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.75}
        >
          <Text style={[styles.label, active && styles.labelActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  btn: { flex: 1, paddingVertical: 9, alignItems: 'center' },
  btnActive: { backgroundColor: Colors.accent },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  labelActive: { color: '#fff', fontWeight: '800' },
});
