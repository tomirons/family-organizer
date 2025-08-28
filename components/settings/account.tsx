import { View } from "react-native";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";
import { Label } from "../ui/label";
import { ErrorMessage, Input } from "../ui/input";
import { Formik } from "formik";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import * as Yup from 'yup';
import axios from "~/lib/axios";
import { toast } from "sonner-native";
import { handleFormValidation } from "~/lib/form";

export default function AccountSettings() {
    const { user, mutate } = useAuthenticationContext();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
    })

    return (
        <Formik
            initialValues={{ name: user?.name, email: user?.email }}
            onSubmit={(values, formikHelpers) => {
                axios.put('/settings/account', values)
                    .then(() => {
                        mutate();
                        toast.success('Account updated successfully');
                    })
                    .catch(error => handleFormValidation(error, formikHelpers));
            }}
            validationSchema={validationSchema}
        >
            {({ values, handleSubmit, handleChange, handleBlur, resetForm }) => (
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>

                    <CardContent className="gap-y-4">
                        <View className="gap-y-1">
                            <Label nativeID="name">Name</Label>
                            <Input nativeID="name" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} />
                            <ErrorMessage name="name" />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="email">Email</Label>
                            <Input nativeID="email" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} />
                            <ErrorMessage name="email" />
                        </View>
                    </CardContent>

                    <CardFooter className="justify-end gap-x-2">
                        <Button variant={'secondary'} onPress={() => resetForm()}>
                            <Text>Reset</Text>
                        </Button>
                        <Button onPress={() => handleSubmit()}>
                            <Text>Submit</Text>
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Formik>
    );
}
