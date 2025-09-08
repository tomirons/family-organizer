export interface Meal {
    id: string | undefined;
    name: string | undefined;
    type_id: string | undefined;
    notes: string | undefined;
    date: Date | undefined;
};

export const EmptyMeal: Meal = {
    id: undefined,
    name: undefined,
    type_id: undefined,
    notes: undefined,
    date: new Date,
};