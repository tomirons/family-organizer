import { AxiosError } from "axios";
import { FormikHelpers } from "formik";
import { get } from "lodash";

export const handleFormValidation = (error: AxiosError, helpers: FormikHelpers<any>) => {
    if (error.response?.status === 422) {
        const errors: Record<string, string[]> = get(error, 'response.data.errors', {});

        Object.keys(errors ?? {}).map((item: string) => {
            helpers.setFieldError(item, errors[item][0]);
        });
    };
}