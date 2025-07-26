import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text"
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { Formik } from "formik";
import axios from "~/lib/axios";
import * as Device from 'expo-device';
import { ErrorMessage, Input } from "~/components/ui/input";
import * as Yup from 'yup';
import { GuestHeader, GuestLayout } from "~/components/layouts/guest";
import { View } from "react-native";

export default function LoginScreen() {
    const { login } = useAuthenticationContext();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required().label('Email'),
        password: Yup.string().required().label('Password'),
    });

    return (
        <GuestLayout>
            <GuestHeader>
                Sign in to your account
            </GuestHeader>
            <Formik
                initialValues={{
                    email: 'test@example.com',
                    password: 'password',
                    password_confirmation: 'password'
                }}
                onSubmit={(values) => {
                    console.log(values);
                    
                }}
                validationSchema={validationSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <>
                        <Card>
                            <View>
                                <View>
                                    <Text className="text-typography-900">Email</Text>
                                    <Input onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
                                    <ErrorMessage name="email" />
                                </View>

                                <View>
                                    <Text className="text-typography-900">Password</Text>
                                    <Input onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
                                    <ErrorMessage name="password" />
                                </View>

                                <Button className="ml-auto" size="sm" onPress={() => handleSubmit()}>
                                    <Text>Login</Text>
                                </Button>
                            </View>
                        </Card>
                    </>
                )}
            </Formik>
        </GuestLayout>
    );
}