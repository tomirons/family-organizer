import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { byPrefixAndName } from '@awesome.me/kit-5314873f9e/icons'
import { Colors } from '~/constants/Colors';
import { useColorScheme } from '~/hooks/useColorScheme';
import Icon from '~/components/ui/icon';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <BottomSheetModalProvider>
      <Tabs
      initialRouteName='settings'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <Icon size={20} icon={byPrefixAndName.fal['calendar']} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={20} icon={byPrefixAndName.fal['circle-user']} color={color} />,
        }}
      />
    </Tabs>
    </BottomSheetModalProvider>
  );
}
