import type { DailyStats, KPIData } from '../types';

export const MOCK_WEEKLY_STATS: DailyStats[] = [
  {
    date: '2026-05-16',
    totalPCBs: 312,
    defectivePCBs: 41,
    defectRate: 13.1,
    defectBreakdown: { 'Missing Hole': 14, 'Short Circuit': 11, 'Mouse Bite': 7, 'Spurious Copper': 5, 'Open Circuit': 3, 'Spur': 1 },
  },
  {
    date: '2026-05-17',
    totalPCBs: 298,
    defectivePCBs: 33,
    defectRate: 11.1,
    defectBreakdown: { 'Missing Hole': 12, 'Short Circuit': 8, 'Mouse Bite': 6, 'Spurious Copper': 4, 'Open Circuit': 2, 'Spur': 1 },
  },
  {
    date: '2026-05-18',
    totalPCBs: 325,
    defectivePCBs: 52,
    defectRate: 16.0,
    defectBreakdown: { 'Missing Hole': 18, 'Short Circuit': 15, 'Mouse Bite': 9, 'Spurious Copper': 6, 'Open Circuit': 4, 'Spur': 0 },
  },
  {
    date: '2026-05-19',
    totalPCBs: 289,
    defectivePCBs: 28,
    defectRate: 9.7,
    defectBreakdown: { 'Missing Hole': 10, 'Short Circuit': 7, 'Mouse Bite': 5, 'Spurious Copper': 3, 'Open Circuit': 2, 'Spur': 1 },
  },
  {
    date: '2026-05-20',
    totalPCBs: 341,
    defectivePCBs: 37,
    defectRate: 10.8,
    defectBreakdown: { 'Missing Hole': 13, 'Short Circuit': 10, 'Mouse Bite': 7, 'Spurious Copper': 4, 'Open Circuit': 2, 'Spur': 1 },
  },
  {
    date: '2026-05-21',
    totalPCBs: 318,
    defectivePCBs: 45,
    defectRate: 14.2,
    defectBreakdown: { 'Missing Hole': 16, 'Short Circuit': 12, 'Mouse Bite': 8, 'Spurious Copper': 5, 'Open Circuit': 3, 'Spur': 1 },
  },
  {
    date: '2026-05-22',
    totalPCBs: 147,
    defectivePCBs: 18,
    defectRate: 12.2,
    defectBreakdown: { 'Missing Hole': 7, 'Short Circuit': 5, 'Mouse Bite': 3, 'Spurious Copper': 2, 'Open Circuit': 1, 'Spur': 0 },
  },
];

export const MOCK_KPI_DATA: KPIData[] = [
  { label: 'Today\'s PCBs', value: 147, change: +8.2, trend: 'up' },
  { label: 'Defect Rate', value: '12.2%', change: -2.0, trend: 'down' },
  { label: 'Detection Acc.', value: '96.4%', change: +0.3, trend: 'up' },
  { label: 'Throughput', value: '28/hr', change: +5.1, trend: 'up' },
];

export const MOCK_DEFECT_DISTRIBUTION = [
  { name: 'Missing Hole', count: 90, color: '#FF1744', legendFontColor: '#6B8CAE', legendFontSize: 12 },
  { name: 'Short Circuit', count: 68, color: '#FF1744', legendFontColor: '#6B8CAE', legendFontSize: 12 },
  { name: 'Mouse Bite', count: 45, color: '#FF9100', legendFontColor: '#6B8CAE', legendFontSize: 12 },
  { name: 'Spur. Copper', count: 29, color: '#9B59B6', legendFontColor: '#6B8CAE', legendFontSize: 12 },
  { name: 'Open Circuit', count: 17, color: '#FF9100', legendFontColor: '#6B8CAE', legendFontSize: 12 },
  { name: 'Spur', count: 5, color: '#00E5FF', legendFontColor: '#6B8CAE', legendFontSize: 12 },
];

export const MOCK_LINE_CHART_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
  datasets: [
    {
      data: [41, 33, 52, 28, 37, 45, 18],
      color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

export const MOCK_THROUGHPUT_DATA = {
  labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  datasets: [{ data: [22, 28, 31, 29, 25, 18] }],
};
