import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Text } from "~/components/ui/text"
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { Formik } from "formik";
import axios from "~/lib/axios";
import { ErrorMessage, Input } from "~/components/ui/input";
import * as Yup from 'yup';
import { GuestHeading, GuestLayout, GuestSubHeading } from "~/components/layouts/guest";
import { View } from "react-native";
import { Link } from "expo-router";
import { handleFormValidation } from "~/lib/form";
import * as Device from 'expo-device';
import { Label } from "~/components/ui/label";

export default function LoginScreen() {
    const { login } = useAuthenticationContext();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required().label('Name'),
        email: Yup.string().email().required().label('Email'),
        password: Yup.string().required().label('Password'),
        password_confirmation: Yup.string().required().label('Confirm Password'),
    });

    return (
        <GuestLayout>
            <GuestHeading>Sign up for an account</GuestHeading>
            <GuestSubHeading>Already registered? <Link className="text-primary" replace href="/login">Sign in</Link></GuestSubHeading>
            <Formik
                initialValues={{
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password',
                    password_confirmation: 'password'
                }}
                onSubmit={(values, formikHelpers) => {
                    axios.post('/register', { ...values, device_name: Device.deviceName })
                        .then(response => {
                            login(response.data.data.token);
                        })
                        .catch((error) => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={validationSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <Card className="pt-6">
                        <CardContent className="gap-y-4">
                            <View>
                                <Label nativeID="name">Name</Label>
                                <Input nativeID="name" className="mt-1" onChangeText={handleChange('name')} onBlur={handleBlur('name')} value={values.name} />
                                <ErrorMessage name="name" />
                            </View>

                            <View>
                                <Label nativeID="email">Email</Label>
                                <Input nativeID="email" className="mt-1" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
                                <ErrorMessage name="email" />
                            </View>

                            <View>
                                <Label nativeID="password">Password</Label>
                                <Input nativeID="password" className="mt-1" onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} secureTextEntry />
                                <ErrorMessage name="password" />
                            </View>

                            <View>
                                <Label nativeID="password_confirmation">Confirm Password</Label>
                                <Input nativeID="password_confirmation" className="mt-1" onChangeText={handleChange('password_confirmation')} onBlur={handleBlur('password_confirmation')} value={values.password_confirmation} secureTextEntry />
                                <ErrorMessage name="password_confirmation" />
                            </View>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onPress={() => handleSubmit()}>
                                <Text>Sign up</Text>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </Formik>
        </GuestLayout>
    );
}