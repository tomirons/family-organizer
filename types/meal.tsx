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
}

export const EmptyMeal: Meal = {
    id: undefined,
    name: undefined,
    type: undefined,
    notes: undefined,
    date: new Date,
};