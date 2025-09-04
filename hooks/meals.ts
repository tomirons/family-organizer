import { FormikValues } from "formik";
import useSWR from "swr";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";

export const useMeals = ({ range, grouped }: { range: string[], grouped: boolean } = { range: [], grouped: false }) => {
    const { household } = useAuthenticationContext();

    return useSWR(
        `/households/${household?.id}/meals`,
        (url) => axios.get(url, { params: { filter: { dates: range }, grouped } }).then((res) => res.data.data)
    );
}

export const createMeal = (household: string, values: FormikValues) => axios.post(`/households/${household}/meals`, values);

export const useMealTypes = () => {
    const { household } = useAuthenticationContext();

    return useSWR(
        `/households/${household?.id}/meal-types`,
        (url) => axios.get(url).then((res) => res.data.data)
    );
}