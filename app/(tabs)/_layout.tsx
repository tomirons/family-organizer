import { Tabs } from 'expo-router';
import React from 'react';
import { byPrefixAndName } from '@awesome.me/kit-5314873f9e/icons'
import Icon from '~/components/ui/icon';
import { useThemeColor } from '~/hooks/useThemeColor';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: useThemeColor('primary'),
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meal Plan',
          tabBarIcon: ({ color }) => <Icon size={20} icon={byPrefixAndName.fal['plate-utensils']} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => <Icon size={20} icon={byPrefixAndName.fal['list-check']} color={color} />,
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
  );
}
