import { AxiosError } from "axios";
import { FormikHelpers } from "formik";
import { get } from "lodash";
import { toast } from "sonner-native";

export const handleFormValidation = (error: AxiosError, helpers: FormikHelpers<any>) => {
    const status = get(error, 'response.status');
    
    if (status === 422) {
        const errors: Record<string, string[]> = get(error, 'response.data.errors', {});

        Object.keys(errors ?? {}).map((item: string) => {
            helpers.setFieldError(item, errors[item][0]);
        });
    } else if (status && (status >= 400 && status < 500)) {
        toast.error(
            get(error, 'response.data.message', 'An error occurred') as string
        );
    }
}