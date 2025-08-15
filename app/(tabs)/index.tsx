import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { startOfWeek } from 'date-fns';
import { groupBy, map } from 'lodash';
import React from 'react';
import {
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
  TimelineList,
  TimelineEventProps,
} from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWR from 'swr';
import { useThemeColor } from '~/hooks/useThemeColor';
import axios from '~/lib/axios';
import { useColorScheme } from '~/lib/useColorScheme';
import * as Device from 'expo-device';
import { DeviceType } from 'expo-device';
import colors from 'tailwindcss/colors'
import { useAuthenticationContext } from '~/contexts/authentication-context';

export default function CalendarTab() {
  const { household } = useAuthenticationContext();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  const { data, isLoading } = useSWR(
    `/households/${household?.id}/events`,
    (url) => axios.get(url).then(res => res.data.data)
  );

  const formattedDates = map(data, (event) => {
    return {
      ...event,
      color: colors[event.color as keyof typeof colors][isDarkColorScheme ? 700 : 300],
    };
  });

  const eventsByDate = groupBy(formattedDates, e => CalendarUtils.getCalendarDateString(e.start)) as {
    [key: string]: TimelineEventProps[];
  };

  const calendarTheme: Theme = {
    calendarBackground: useThemeColor('background'),
    monthTextColor: useThemeColor('foreground'),
    textMonthFontSize: 24,
    textMonthFontWeight: 500,
    selectedDayBackgroundColor: useThemeColor('primary'),
    selectedDayTextColor: useThemeColor('primary-foreground'),
    todayBackgroundColor: useThemeColor('primary'),
    todayTextColor: useThemeColor('primary-foreground'),
    dayTextColor: useThemeColor('primary'),
    textSectionTitleColor: useThemeColor('primary'),
    line: {
      backgroundColor: useThemeColor('border'),
    },
    verticalLine: {
      backgroundColor: useThemeColor('border'),
    },
    timelineContainer: {
      marginBottom: tabBarHeight + insets.bottom
    },
    arrowColor: useThemeColor('primary'),
    timeLabel: {
      color: useThemeColor('muted-foreground')
    },
    event: {
      // Maybe we can get this to work with the dynamic colors later?
      borderWidth: 0
    },
    eventTitle: {
      color: useThemeColor('foreground')
    },
    eventSummary: {
      color: useThemeColor('foreground')
    },
    eventTimes: {
      color: useThemeColor('foreground')
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
      <CalendarProvider
        date={startOfWeek(Date(), { weekStartsOn: 1 }).toDateString()}
        disabledOpacity={0.6}
        todayBottomMargin={insets.bottom}
        numberOfDays={Device.deviceType === DeviceType.TABLET ? 7 : 1}
        style={{
          paddingBottom: tabBarHeight,
        }}
      >
        <ExpandableCalendar
          key={`calendar-${colorScheme}`}
          firstDay={1}
          theme={calendarTheme}
          hideArrows
        />
        <TimelineList
          key={`timeline-${colorScheme}`}
          events={eventsByDate}
          timelineProps={{
            format24h: false,
            overlapEventsSpacing: 8,
            rightEdgeSpacing: 24,
            theme: calendarTheme,
          }}
          scrollToFirst
        />
      </CalendarProvider>
    </SafeAreaView>
  );
}