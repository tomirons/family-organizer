import { View } from "react-native";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";
import { Label } from "../ui/label";
import { ErrorMessage, Input } from "../ui/input";
import { Formik } from "formik";
import * as Yup from 'yup';
import axios from "~/lib/axios";
import { toast } from "sonner-native";
import { handleFormValidation } from "~/lib/form";

export default function PasswordSettings() {
    const validationSchema = Yup.object().shape({
        current: Yup.string().required("Current password is required"),
        password: Yup.string().required("New password is required"),
        password_confirmation: Yup.string().required("New password confirmation is required"),
    })

    return (
        <Formik
            initialValues={{ current: '', password: '', password_confirmation: '' }}
            onSubmit={(values, formikHelpers) => {
                axios.put('/settings/password', values)
                    .then(() => {
                        toast.success('Password updated successfully');
                    })
                    .catch(error => handleFormValidation(error, formikHelpers));
            }}
            validationSchema={validationSchema}
        >
            {({ values, handleSubmit, handleChange, handleBlur, resetForm }) => (
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                    </CardHeader>

                    <CardContent className="gap-y-4">
                        <View className="gap-y-1">
                            <Label nativeID="current">Current Password</Label>
                            <Input nativeID="current" value={values.current} onChangeText={handleChange('current')} onBlur={handleBlur('current')} secureTextEntry />
                            <ErrorMessage name="current" />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="password">New Password</Label>
                            <Input nativeID="password" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} secureTextEntry />
                            <ErrorMessage name="password" />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="confirm">Confirm New Password</Label>
                            <Input nativeID="confirm" value={values.password_confirmation} onChangeText={handleChange('password_confirmation')} onBlur={handleBlur('password_confirmation')} secureTextEntry />
                            <ErrorMessage name="password_confirmation" />
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
