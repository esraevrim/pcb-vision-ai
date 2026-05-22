import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';

const navTheme = {
  dark: true,
  colors: {
    primary: '#00A8FF',
    background: '#060B14',
    card: '#0D1526',
    text: '#E8F4FF',
    border: '#1E3A5F',
    notification: '#FF1744',
  },
};

export const AppNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <TabNavigator />
  </NavigationContainer>
);
