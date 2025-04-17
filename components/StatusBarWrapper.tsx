// components/StatusBarWrapper.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StatusBarWrapperProps = {
  backgroundColor?: string;
  barStyle?: 'light' | 'dark' | 'auto';
};

export default function StatusBarWrapper({
  backgroundColor = '#1E3A8A',
  barStyle = 'light'
}: StatusBarWrapperProps) {
  const insets = useSafeAreaInsets();

  // En Android necesitamos un View extra para el color de fondo
  return (
    <>
      <StatusBar style={barStyle} backgroundColor={backgroundColor} />
      {Platform.OS === 'android' && (
        <View
          style={{
            height: insets.top,
            backgroundColor,
          }}
        />
      )}
    </>
  );
}