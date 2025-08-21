import { FormikValues } from "formik";
import useSWR from "swr";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";

export const useHouseholdMembers = () => {
    const { household } = useAuthenticationContext();

    const { data, isLoading, mutate } = useSWR(
        `/households/${household?.id}/members`,
        (url) => axios.get(url).then((res) => res.data.data)
    );

    return { data, isLoading, mutate };
}

export const createHouseholdMember = (household: string, values: FormikValues) => axios.post(`/households/${household}/members`, values)