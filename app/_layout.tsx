import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from 'sonner-native';
import { SWRConfig } from 'swr';
import { AuthenticationProvider, useAuthenticationContext } from '~/contexts/authentication-context';
import { MealPlanProvider } from '~/contexts/mealplan-context';
import { TasksProvider } from '~/contexts/tasks-context';
import { isTablet } from '~/hooks/useDevice';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import '../global.css';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => true,
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /* If it's resuming from background or inactive mode to active one */
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener(
            "change",
            onAppStateChange,
          );

          return () => {
            subscription.remove();
          };
        },
      }}
    >
      <KeyboardProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <GestureHandlerRootView>
            <AuthenticationProvider>
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />

              <MealPlanProvider>
                <TasksProvider>
                  <Screens />
                </TasksProvider>
              </MealPlanProvider>

              <Toaster
                style={{ marginHorizontal: 'auto', width: isTablet ? 500 : '100%' }}
              />
              <PortalHost />
            </AuthenticationProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </KeyboardProvider>
    </SWRConfig>
  );
}

function Screens() {
  const { isAuthenticated, shouldShowOnboarding, isInOnboardingFlow } = useAuthenticationContext();

  return (
    <>
      <Stack>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Protected guard={shouldShowOnboarding || isInOnboardingFlow}>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          </Stack.Protected>

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="household/change" options={{ headerShown: false, presentation: 'formSheet', contentStyle: { height: '100%' } }} />
          <Stack.Screen name="household/create" options={{ headerShown: false, presentation: 'formSheet', contentStyle: { height: '100%' } }} />
          <Stack.Screen name="household/members" options={{ headerShown: false, presentation: 'formSheet', contentStyle: { height: '100%' } }} />
          <Stack.Screen name="meals/form" options={{ headerShown: false, presentation: 'formSheet', contentStyle: { height: '100%' } }} />
          <Stack.Screen name="meals/types/form" options={{ headerShown: false, presentation: 'formSheet', contentStyle: { height: '100%' } }} />
        </Stack.Protected>

        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;