import { format } from "date-fns";
import { FormikValues } from "formik";
import useSWR from "swr";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { DateRange, useMealPlanContext } from "~/contexts/mealplan-context";
import axios from "~/lib/axios";

export const useMeals = ({ grouped }: { grouped: boolean } = { grouped: true }) => {
    const { household } = useAuthenticationContext();
    const { dateRange } = useMealPlanContext();

    return useSWR(
        [`/households/${household?.id}/meals`, dateRange],
        ([url, dateRange]: [string, DateRange]) => axios.get(url, {
            params: {
                filter: {
                    dates: [format(dateRange.start, 'yyyy-MM-dd'), format(dateRange.end, 'yyyy-MM-dd')]
                },
                grouped
            }
        }).then((res) => res.data.data)
    );
}

export const createMeal = (household: string, values: FormikValues) => axios.post(`/households/${household}/meals`, values);

export const showMeal = (household: string, id: string) => axios.get(`/households/${household}/meals/${id}`);

export const updateMeal = (household: string, id: string, values: FormikValues) => axios.put(`/households/${household}/meals/${id}`, values);

export const useMealTypes = () => {
    const { household } = useAuthenticationContext();

    return useSWR(
        `/households/${household?.id}/meal-types`,
        (url) => axios.get(url).then((res) => res.data.data)
    );
}

export const createMealType = (householdId: string, values: FormikValues) => axios.post(`/households/${householdId}/meal-types`, values);

export const showMealType = (household: string, id: string) => axios.get(`/households/${household}/meal-types/${id}`);

export const updateMealType = (householdId: string, mealTypeId: string, values: FormikValues) => axios.put(`/households/${householdId}/meal-types/${mealTypeId}`, values);