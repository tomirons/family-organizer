import { FormikValues } from "formik";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { useTasksContext } from "~/contexts/tasks-context";
import axios from "~/lib/axios";

export const useLists = () => {
    const { household } = useAuthenticationContext();

    return useSWR(
        `households/${household?.id}/lists`,
        (url) => axios.get(url).then((res) => res.data.data)
    );
};

export const createList = (household: string, values: FormikValues) => axios.post(`/households/${household}/lists`, values);

export const useTasks = (list: string) => {
    const { household } = useAuthenticationContext();
    const { showCompletedTasks } = useTasksContext();

    return useSWR(
        [`/households/${household?.id}/lists/${list}/tasks`, showCompletedTasks],
        ([url, showCompletedTasks]) => axios
            .get(url, {
                params: {
                    filter: !showCompletedTasks ? { incomplete: true } : undefined
                }
            })
            .then((res) => res.data.data)
    );
};

export const createTask = (household: string, list: string, values: FormikValues) => axios.post(`/households/${household}/lists/${list}/tasks`, values);

export const updateTask = (household: string, list: string, id: string, values: FormikValues) => axios.put(`/households/${household}/lists/${list}/tasks/${id}`, values);

export const useMarkTaskAs = (list: string) => {
    const { household } = useAuthenticationContext();

    return useSWRMutation(
        `/households/${household?.id}/lists/${list}/tasks`,
        (url: string, { arg }: { arg: { id: string, checked: boolean} }) => axios.post(`${url}/${arg.id}/${arg.checked ? 'complete' : 'incomplete'}`)
    );
};

export const markTaskAsComplete = (household: string, list: string, id: string) => axios.post(`/households/${household}/lists/${list}/tasks/${id}/complete`);

export const markTaskAsIncomplete = (household: string, list: string, id: string) => axios.post(`/households/${household}/lists/${list}/tasks/${id}/incomplete`);