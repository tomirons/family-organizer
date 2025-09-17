import { byPrefixAndName } from '@awesome.me/kit-5314873f9e/icons';
import { UTCDate } from '@date-fns/utc';
import { format } from 'date-fns';
import { Link, router } from 'expo-router';
import { isEmpty, map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle } from '~/components/ui/card';
import Icon from '~/components/ui/icon';
import { Skeleton } from '~/components/ui/skeleton';
import { Text } from '~/components/ui/text';
import { useMealPlanContext } from '~/contexts/mealplan-context';
import { useMeals } from '~/hooks/meals';
import { isTablet } from '~/hooks/useDevice';
import { useOrientation } from '~/hooks/useOrientation';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { Meal } from '~/types/meal';

export default function MealsTab() {
    const { isDarkColorScheme } = useColorScheme();
    const { isLandscape } = useOrientation();
    const { dateRange, goToNextWeek, goToPreviousWeek } = useMealPlanContext();
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

    const translateX = useSharedValue(0);
    const headerTranslateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const { data, isLoading } = useMeals();

    const resetAnimation = useCallback(() => {
        const direction = animationDirection === 'left' ? -1 : 1;
        translateX.value = -direction * 300;
        translateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.out(Easing.ease)
        });
        headerTranslateX.value = -direction * 50;
        headerTranslateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.out(Easing.ease)
        });
        opacity.value = withTiming(1, {
            duration: 200,
            easing: Easing.out(Easing.ease)
        });
    }, [animationDirection, headerTranslateX, opacity, translateX]);

    useEffect(() => {
        if (animationDirection) {
            const direction = animationDirection === 'left' ? -1 : 1;

            translateX.value = withTiming(direction * 300, {
                duration: 200,
                easing: Easing.out(Easing.ease)
            }, () => {
                'worklet';
                runOnJS(resetAnimation)();
            });

            headerTranslateX.value = withTiming(direction * 50, {
                duration: 200,
                easing: Easing.out(Easing.ease)
            });

            opacity.value = withTiming(0, {
                duration: 200,
                easing: Easing.out(Easing.ease)
            });
        }
    }, [animationDirection, headerTranslateX, opacity, resetAnimation, translateX]);

    const handleGoToNextWeek = () => {
        setAnimationDirection('left');
        goToNextWeek();
    };

    const handleGoToPreviousWeek = () => {
        setAnimationDirection('right');
        goToPreviousWeek();
    };

    const cardColors = [
        colors.red,
        colors.orange,
        colors.yellow,
        colors.green,
        colors.blue,
    ]

    const useHorizontalLayout = isTablet && isLandscape;
    const useTwoColumnLayout = isTablet && !isLandscape;

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: headerTranslateX.value }],
            opacity: opacity.value
        };
    });

    const animatedContentStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            opacity: opacity.value
        };
    });

    return (
        <SafeAreaView className={`flex-1 pt-6`} edges={['top', 'left', 'right']}>
            <View className='flex-row justify-between border-b border-border pb-4 px-6'>
                <Button className='rounded-full' variant="secondary" size="icon" onPress={() => handleGoToPreviousWeek()}>
                    <Icon icon={byPrefixAndName.fal['chevron-left']} size={16} className='text-secondary-foreground' />
                </Button>
                <Animated.View style={animatedHeaderStyle}>
                    <Text
                        key={`${dateRange.start.getTime()}-${dateRange.end.getTime()}`}
                        className='text-2xl'
                        variant={'large'}
                    >
                        {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d')}
                    </Text>
                </Animated.View>
                <Button className='rounded-full' variant="secondary" size="icon" onPress={() => handleGoToNextWeek()}>
                    <Icon icon={byPrefixAndName.fal['chevron-right']} size={16} className='text-secondary-foreground' />
                </Button>
            </View>

            <Animated.ScrollView
                style={animatedContentStyle}
                horizontal={useHorizontalLayout}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                className={cn('flex-1 pt-4')}
                contentContainerClassName={cn(
                    'px-6',
                    useHorizontalLayout && 'flex-row gap-x-6 h-full',
                    useTwoColumnLayout && 'flex-row flex-wrap gap-x-6',
                    !useHorizontalLayout && !useTwoColumnLayout && 'gap-y-8'
                )}
            >
                {map(data, (group, index) => (
                    <View
                        key={index}
                        className={cn(
                            useHorizontalLayout && 'h-full w-[350px]',
                            useTwoColumnLayout && 'w-[48.65%] mb-8'
                        )}
                    >
                        {isLoading ? (
                            <View className='gap-y-4'>
                                <Skeleton className='h-14' />
                                <Skeleton className='h-24' />
                                <Skeleton className='h-24' />
                                <Skeleton className='h-24' />
                            </View>
                        ) : (
                            <>
                                <View className='flex-row justify-between items-center mb-4'>
                                    <Text variant={'h4'}>{format(new UTCDate(group.date), 'EEEE, MMMM d')}</Text>
                                    <Link asChild href={{
                                        pathname: '/meals/form',
                                        params: { date: group.date }
                                    }}>
                                        <Button className='rounded-full size-8' variant={'secondary'} size={'icon'}>
                                            <Icon size={12} icon={byPrefixAndName.fal['plus']} className='text-secondary-foreground' />
                                        </Button>
                                    </Link>
                                </View>
                                <View className={cn('gap-y-4', useHorizontalLayout && 'flex-1 pb-4')}>
                                    {isEmpty(group.items) ? (
                                        <Text className='text-sm text-muted-foreground'>No meals planned</Text>
                                    ) : group.items.map((meal: Meal, index: number) => (
                                        <TouchableOpacity
                                            key={meal.id}
                                            className='flex-1'
                                            onPress={() => router.push({
                                                pathname: '/meals/form',
                                                params: {
                                                    id: meal.id,
                                                    date: group.date
                                                }
                                            })}
                                        >
                                            <Card
                                                className='flex-1 p-0'
                                                style={{
                                                    borderColor: isDarkColorScheme ? cardColors[index % cardColors.length][900] : cardColors[index % cardColors.length][200],
                                                    backgroundColor: isDarkColorScheme ? cardColors[index % cardColors.length][950] : cardColors[index % cardColors.length][50]
                                                }}
                                            >
                                                <CardHeader className='p-3'>
                                                    <Text className='text-sm text-muted-foreground uppercase'>{meal.type?.name}</Text>
                                                    <CardTitle className='text-lg font-medium'>{meal.name}</CardTitle>
                                                </CardHeader>
                                            </Card>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                ))}
            </Animated.ScrollView>
        </SafeAreaView >
    )
}