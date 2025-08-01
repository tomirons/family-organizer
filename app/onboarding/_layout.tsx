import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="household" />
            <Stack.Screen name="members" />
        </Stack>
    )
}
