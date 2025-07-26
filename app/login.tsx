import * as Device from 'expo-device';
import { Link } from "expo-router";
import { Formik } from "formik";
import { View } from "react-native";
import * as Yup from 'yup';
import { GuestHeading, GuestLayout, GuestSubHeading } from "~/components/layouts/guest";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";
import { handleFormValidation } from '~/lib/form';

export default function LoginScreen() {
    const { login } = useAuthenticationContext();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required().label('Email'),
        password: Yup.string().required().label('Password'),
    });

    return (
        <GuestLayout>
            <GuestHeading>Sign in to your account</GuestHeading>
            <GuestSubHeading>Don&apos;t have an account? <Link className="text-primary" replace href="/register">Sign up</Link></GuestSubHeading>
            <Formik
                initialValues={{
                    email: 'test@example.com',
                    password: 'passwor'
                }}
                onSubmit={(values, formikHelpers) => {
                    axios.post('/login', { ...values, device_name: Device.deviceName })
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
                                <Text>Email</Text>
                                <Input onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
                                <ErrorMessage name="email" />
                            </View>

                            <View>
                                <Text>Password</Text>
                                <Input onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} secureTextEntry />
                                <ErrorMessage name="password" />
                            </View>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onPress={() => handleSubmit()}>
                                <Text>Sign in</Text>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </Formik>
        </GuestLayout>
    );
}