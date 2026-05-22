import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootTabParamList = {
  Dashboard: undefined;
  Live: undefined;
  Manual: undefined;
  Statistics: undefined;
};

export type DashboardScreenProps = BottomTabScreenProps<RootTabParamList, 'Dashboard'>;
export type LiveScreenProps = BottomTabScreenProps<RootTabParamList, 'Live'>;
export type ManualScreenProps = BottomTabScreenProps<RootTabParamList, 'Manual'>;
export type StatisticsScreenProps = BottomTabScreenProps<RootTabParamList, 'Statistics'>;
