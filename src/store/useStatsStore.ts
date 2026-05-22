import { create } from 'zustand';
import type { DailyStats } from '../types';
import { MOCK_WEEKLY_STATS } from '../mock/statistics';

type DateRange = '7d' | '30d' | '90d';

interface StatsStore {
  dateRange: DateRange;
  searchQuery: string;
  weeklyData: DailyStats[];
  isLoading: boolean;

  setDateRange: (range: DateRange) => void;
  setSearchQuery: (query: string) => void;
  refreshData: () => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  dateRange: '7d',
  searchQuery: '',
  weeklyData: MOCK_WEEKLY_STATS,
  isLoading: false,

  setDateRange: (dateRange) => set({ dateRange }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  refreshData: () => {
    set({ isLoading: true });
    setTimeout(() => set({ isLoading: false, weeklyData: MOCK_WEEKLY_STATS }), 1000);
  },
}));
