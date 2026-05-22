import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Home, Camera, FileSearch, BarChart2 } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import type { RootTabParamList } from './types';

import DashboardScreen from '../screens/DashboardScreen';
import LiveDetectionScreen from '../screens/LiveDetectionScreen';
import ManualDetectionScreen from '../screens/ManualDetectionScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabBar = ({ color, size, focused, name }: { color: string; size: number; focused: boolean; name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Dashboard: <Home size={size} color={color} />,
    Live: <Camera size={size} color={color} />,
    Manual: <FileSearch size={size} color={color} />,
    Statistics: <BarChart2 size={size} color={color} />,
  };
  return icons[name] ?? null;
};

export const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.accent,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ color, size, focused }) => (
        <TabBar color={color} size={size} focused={focused} name={route.name} />
      ),
      tabBarBackground: () => <View style={styles.tabBarBg} />,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Live" component={LiveDetectionScreen} options={{ tabBarLabel: 'Live' }} />
    <Tab.Screen name="Manual" component={ManualDetectionScreen} options={{ tabBarLabel: 'Inspect' }} />
    <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ tabBarLabel: 'Reports' }} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bgSurface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
