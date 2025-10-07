import { FormikValues } from "formik";
import useSWR from "swr";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";

export const useLists = (includeIncomplete: boolean = true) => {
    const { household } = useAuthenticationContext();

    return useSWR(
        [`households/${household?.id}/lists`, includeIncomplete],
        ([url, includeIncomplete]) => axios
            .get(url, {
                params: {
                    include: 'tasks',
                    filter: includeIncomplete ? { incomplete: true } : undefined
                }
            })
            .then((res) => res.data.data)
    );
};

export const createList = (household: string, values: FormikValues) => axios.post(`/households/${household}/lists`, values);

export const createTask = (household: string, list: string, values: FormikValues) => axios.post(`/households/${household}/lists/${list}/tasks`, values);

export const updateTask = (household: string, list: string, id: string, values: FormikValues) => axios.put(`/households/${household}/lists/${list}/tasks/${id}`, values);