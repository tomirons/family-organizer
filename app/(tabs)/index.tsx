import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { startOfWeek } from 'date-fns';
import { groupBy } from 'lodash';
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
import { useThemeColor } from '~/hooks/useThemeColor';
import { useColorScheme } from '~/lib/useColorScheme';

const EVENT_COLOR = '#e6add8';
const today = new Date();
const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

const timelineEvents: TimelineEventProps[] = [
  {
    start: `${getDate(-1)} 09:20:00`,
    end: `${getDate(-1)} 12:00:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  },
  {
    start: `${getDate()} 01:15:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting A',
    summary: 'Summary for meeting A',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:30:00`,
    end: `${getDate()} 02:30:00`,
    title: 'Meeting B',
    summary: 'Summary for meeting B',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 01:45:00`,
    end: `${getDate()} 02:45:00`,
    title: 'Meeting C',
    summary: 'Summary for meeting C',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:40:00`,
    end: `${getDate()} 03:10:00`,
    title: 'Meeting D',
    summary: 'Summary for meeting D',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 02:50:00`,
    end: `${getDate()} 03:20:00`,
    title: 'Meeting E',
    summary: 'Summary for meeting E',
    color: EVENT_COLOR
  },
  {
    start: `${getDate()} 04:30:00`,
    end: `${getDate()} 05:30:00`,
    title: 'Meeting F',
    summary: 'Summary for meeting F',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 00:30:00`,
    end: `${getDate(1)} 01:30:00`,
    title: 'Visit Grand Mother',
    summary: 'Visit Grand Mother and bring some fruits.',
    color: 'lightblue'
  },
  {
    start: `${getDate(1)} 02:30:00`,
    end: `${getDate(1)} 03:20:00`,
    title: 'Meeting with Prof. Behjet Zuhaira',
    summary: 'Meeting with Prof. Behjet at 130 in her office.',
    color: EVENT_COLOR
  },
  {
    start: `${getDate(1)} 04:10:00`,
    end: `${getDate(1)} 04:40:00`,
    title: 'Tea Time with Dr. Hasan',
    summary: 'Tea Time with Dr. Hasan, Talk about Project'
  },
  {
    start: `${getDate(1)} 01:05:00`,
    end: `${getDate(1)} 01:35:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(1)} 14:30:00`,
    end: `${getDate(1)} 16:30:00`,
    title: 'Meeting Some Friends in ARMED',
    summary: 'Arsalan, Hasnaat, Talha, Waleed, Bilal',
    color: 'pink'
  },
  {
    start: `${getDate(2)} 01:40:00`,
    end: `${getDate(2)} 02:25:00`,
    title: 'Meet Sir Khurram Iqbal',
    summary: 'Computer Science Dept. Comsats Islamabad',
    color: 'orange'
  },
  {
    start: `${getDate(2)} 04:10:00`,
    end: `${getDate(2)} 04:40:00`,
    title: 'Tea Time with Colleagues',
    summary: 'WeRplay'
  },
  {
    start: `${getDate(2)} 00:45:00`,
    end: `${getDate(2)} 01:45:00`,
    title: 'Lets Play Apex Legends',
    summary: 'with Boys at Work'
  },
  {
    start: `${getDate(2)} 11:30:00`,
    end: `${getDate(2)} 12:30:00`,
    title: 'Dr. Mariana Joseph',
    summary: '3412 Piedmont Rd NE, GA 3032'
  },
  {
    start: `${getDate(4)} 12:10:00`,
    end: `${getDate(4)} 13:45:00`,
    title: 'Merge Request to React Native Calendars',
    summary: 'Merge Timeline Calendar to React Native Calendars'
  }
];

const INITIAL_TIME = { hour: 9, minutes: 0 };

export default function TimelineCalendarScreen() {
  const insets = useSafeAreaInsets();

  const tabBarHeight = useBottomTabBarHeight();

  const { colorScheme } = useColorScheme();

  const eventsByDate = groupBy(timelineEvents, e => CalendarUtils.getCalendarDateString(e.start)) as {
    [key: string]: TimelineEventProps[];
  }

  const calendarTheme: Theme = {
    calendarBackground: useThemeColor('background'),
    monthTextColor: useThemeColor('foreground'),
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
    }
  };

  return (
    <SafeAreaView className='flex-1' edges={['top', 'left', 'right']}>
      <CalendarProvider
        date={startOfWeek(Date(), { weekStartsOn: 1 }).toDateString()}
        disabledOpacity={0.6}
        todayBottomMargin={insets.bottom}
        numberOfDays={7}
        style={{
          paddingBottom: tabBarHeight,
        }}
      >
        <ExpandableCalendar
          key={`calendar-${colorScheme}`}
          firstDay={1}
          theme={calendarTheme}
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
          scrollToNow
          initialTime={INITIAL_TIME}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
}