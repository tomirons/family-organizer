import { roundToNearestMinutes } from "date-fns";

export interface Meal {
    id: string | undefined;
    name: string | undefined;
    type: MealType | undefined;
    notes: string | undefined;
    date: Date | undefined;
};

export interface MealType {
    id: string | undefined;
    name: string | undefined;
    time: Date | undefined;
}

export const EmptyMeal: Meal = {
    id: undefined,
    name: undefined,
    type: undefined,
    notes: undefined,
    date: new Date,
};

export const EmptyMealType: MealType = {
    id: undefined,
    name: undefined,
    time: roundToNearestMinutes(new Date, { nearestTo: 15 }),
};
