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