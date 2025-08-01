import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, P } from "~/components/ui/typography";
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
        <SafeAreaView className="px-6 flex-1 gap-y-8">
            <View className="items-center mt-12 gap-y-4">
                <H1>Name Your Household</H1>
            </View>

            <Image
                style={{ width: '100%', height: 200 }}
                source={require("~/assets/images/onboarding/step-2.png")}
                contentFit="contain"
            />

            <Formik
                initialValues={{
                    name: "My Household",
                }}
                onSubmit={(values, formikHelpers) => {
                    axios
                        .post('/households', values)
                        .then((r) => {                            
                            router.navigate({
                                pathname: '/onboarding/members',
                                params: { household: r.data.data.id }
                            });
                        })
                        .catch((error) => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={validationSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <View className="flex-1 justify-between">
                        <View className="gap-y-4">
                            <P className="text-lg">
                                Every great household needs a iconic name! Is yours <Text className="text-lg font-semibold">The Glitter Palace</Text> or <Text className="text-lg font-semibold">Couch Potato HQ</Text>? Give it a title that screams <Text className="italic text-lg font-semibold">us</Text> and sets the tone for fun. What name&apos;s calling your heart?
                            </P>

                            <View className="gap-y-2">
                                <Label nativeID="name">Name</Label>
                                <Input nativeID="name" onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name} />
                                <ErrorMessage name="name" />
                            </View>
                        </View>

                        <Button onPress={() => handleSubmit()}>
                            <Text>Continue</Text>
                        </Button>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    )
}