import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H4, Large } from "~/components/ui/typography";
import { Button } from '~/components/ui/button';
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import axios from '~/lib/axios';
import { groupBy, map } from 'lodash';
import { Card, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { isTablet } from '~/hooks/useDevice';
import { useOrientation } from '~/hooks/useOrientation';
import colors from 'tailwindcss/colors';
import { useColorScheme } from '~/lib/useColorScheme';
import useSWR from 'swr';
import { useAuthenticationContext } from '~/contexts/authentication-context';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeOutDown
} from 'react-native-reanimated';
import Icon from '~/components/ui/icon';
import { byPrefixAndName } from '@awesome.me/kit-5314873f9e/icons';

type DateRange = {
    start: Date;
    end: Date;
}

export default function MealsTab() {
    const { household } = useAuthenticationContext();
    const { isDarkColorScheme } = useColorScheme();
    const { isLandscape } = useOrientation();
    const [dateRange, setDateRange] = useState<DateRange>({
        start: startOfWeek(new Date, { weekStartsOn: 1 }),
        end: endOfWeek(new Date, { weekStartsOn: 1 })
    });

    const { data, isLoading } = useSWR(
        [`/households/${household?.id}/meals`, dateRange],
        ([url, dateRange]: [string, DateRange]) => axios.get(url, {
            params: {
                filter: {
                    dates: `${format(dateRange.start, 'yyyy-MM-dd')},${format(dateRange.end, 'yyyy-MM-dd')}`
                }
            }
        }).then(res => res.data.data)
    )

    if (isLoading) {
        return null;
    }

    const goToNextWeek = () => {
        setDateRange({
            start: addWeeks(dateRange.start, 1),
            end: addWeeks(dateRange.end, 1)
        });
    }

    const goToPreviousWeek = () => {
        setDateRange({
            start: subWeeks(dateRange.start, 1),
            end: subWeeks(dateRange.end, 1)
        });
    }

    const cardColors = [
        colors.red,
        colors.orange,
        colors.yellow,
        colors.green,
        colors.blue,
    ]

    interface Meal {
        id: number;
        name: string;
        type: string;
    }

    const useHorizontalLayout = isTablet && isLandscape;
    const useTwoColumnLayout = isTablet && !isLandscape;

    const groupedData = groupBy(data, 'date');

    const AnimatedCard = Animated.createAnimatedComponent(Card);
    const AnimatedText = Animated.createAnimatedComponent(Large);

    return (
        <SafeAreaView className={`flex-1 pt-6`} edges={['top', 'left', 'right']}>
            <View className='flex-row justify-between border-b border-border pb-4 px-6'>
                <Button className='rounded-full' variant="secondary" size="icon" onPress={() => goToPreviousWeek()}>
                    <Ionicons name="chevron-back" size={20} color="#374151" />
                </Button>
                <AnimatedText
                    key={`${dateRange.start.getTime()}-${dateRange.end.getTime()}`}
                    entering={FadeInUp.duration(300).springify()}
                    exiting={FadeOutDown.duration(200)}
                    className='text-2xl'
                >
                    {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d')}
                </AnimatedText>
                <Button className='rounded-full' variant="secondary" size="icon" onPress={() => goToNextWeek()}>
                    <Ionicons name="chevron-forward" size={20} color="#374151" />
                </Button>
            </View>

            <ScrollView
                horizontal={useHorizontalLayout}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                className={cn('flex-1 pt-4')}
                contentContainerClassName='px-6'
            >
                <View
                    className={cn(
                        useHorizontalLayout && 'flex-row gap-x-6 h-full',
                        useTwoColumnLayout && 'flex-row flex-wrap gap-x-6',
                        !useHorizontalLayout && !useTwoColumnLayout && 'gap-y-8'
                    )}>
                    {map(groupedData, (items, date) => (
                        <Animated.View
                            key={date}
                            entering={FadeInDown.delay(Object.keys(groupedData).indexOf(date) * 100).springify()}
                            className={cn(
                                useHorizontalLayout && 'h-full w-[350px]',
                                useTwoColumnLayout && 'w-[48.65%] mb-8'
                            )}
                        >
                            <View className='flex-row justify-between items-center mb-4'>
                                <H4>{format(new Date(date), 'EEEE, MMMM d')}</H4>
                                <Button className='rounded-full size-8' variant={'secondary'} size={'icon'}>
                                    <Icon size={10} icon={byPrefixAndName.fal['plus']} />
                                </Button>
                            </View>
                            <View className={cn('gap-y-4', useHorizontalLayout && 'flex-1 pb-4')}>
                                {items.map((item: Meal, index) => (
                                    <AnimatedCard
                                        key={item.id}
                                        entering={FadeInUp.delay(Object.keys(groupedData).indexOf(date) * 100 + index * 75)
                                            .springify()
                                            .damping(15)
                                            .stiffness(100)}
                                        className='flex-1'
                                        style={{
                                            borderColor: isDarkColorScheme ? cardColors[index % cardColors.length][900] : cardColors[index % cardColors.length][200],
                                            backgroundColor: isDarkColorScheme ? cardColors[index % cardColors.length][950] : cardColors[index % cardColors.length][50]
                                        }}
                                    >
                                        <CardHeader className='p-3'>
                                            <Text className='text-sm text-muted-foreground uppercase'>{item.type}</Text>
                                            <CardTitle className='text-lg font-medium'>{item.name}</CardTitle>
                                        </CardHeader>
                                    </AnimatedCard>
                                ))}
                            </View>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}