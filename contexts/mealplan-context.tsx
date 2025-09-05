import { addWeeks, endOfWeek, startOfWeek, subWeeks } from 'date-fns';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type DateRange = {
    start: Date;
    end: Date;
};

interface MealPlanContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    goToNextWeek: () => void;
    goToPreviousWeek: () => void;
    goToCurrentWeek: () => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

interface MealPlanProviderProps {
    children: ReactNode;
}

export function MealPlanProvider({ children }: MealPlanProviderProps) {
    const [dateRange, setDateRange] = useState<DateRange>({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 })
    });

    const goToNextWeek = () => {
        setDateRange({
            start: addWeeks(dateRange.start, 1),
            end: addWeeks(dateRange.end, 1)
        });
    };

    const goToPreviousWeek = () => {
        setDateRange({
            start: subWeeks(dateRange.start, 1),
            end: subWeeks(dateRange.end, 1)
        });
    };

    const goToCurrentWeek = () => {
        setDateRange({
            start: startOfWeek(new Date(), { weekStartsOn: 1 }),
            end: endOfWeek(new Date(), { weekStartsOn: 1 })
        });
    };

    const value: MealPlanContextType = {
        dateRange,
        setDateRange,
        goToNextWeek,
        goToPreviousWeek,
        goToCurrentWeek
    };

    return (
        <MealPlanContext.Provider value={value}>
            {children}
        </MealPlanContext.Provider>
    );
}

export function useMealPlanContext() {
    const context = useContext(MealPlanContext);
    if (context === undefined) {
        throw new Error('useMealPlanContext must be used within a MealPlanProvider');
    }
    return context;
}
