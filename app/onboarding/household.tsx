import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1 } from "~/components/ui/typography";
import { Image } from "expo-image";
import { Formik } from "formik";
import * as Yup from 'yup';
import { ErrorMessage, Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { router } from "expo-router";

const validationSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
});

export default function OnboardingStepTwo() {
    return (
        <SafeAreaView className="px-6 flex-1 gap-y-16">
            <View className="items-center mt-24 gap-y-4">
                <H1>Name Your Household</H1>
            </View>

            <Image
                style={{ width: '100%', height: 300 }}
                source={require("~/assets/images/onboarding/step-2.png")}
                contentFit="contain"
            />

            <View className="flex-1 justify-between">
                <Formik
                    initialValues={{
                        name: "My Household",
                    }}
                    onSubmit={(values, formikHelpers) => {
                        axios
                            .post('/households', values)
                            .then(() => {
                                router.push('/onboarding/members');
                            })
                            .catch((error) => handleFormValidation(error, formikHelpers));
                    }}
                    validationSchema={validationSchema}
                >
                    {({ values, handleChange, handleBlur, handleSubmit }) => (
                        <>
                            <View className="gap-y-4">
                                <Text>What&apos;s your household&apos;s nickname? Have fun with it!</Text>

                                <View className="gap-y-2">
                                    <Label nativeID="name">Name</Label>
                                    <Input nativeID="name" onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name} />
                                    <ErrorMessage name="name" />
                                </View>
                            </View>

                            <Button onPress={() => handleSubmit()}>
                                <Text>Continue</Text>
                            </Button>
                        </>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    )
}