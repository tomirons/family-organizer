import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { Formik } from "formik";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { router } from "expo-router";
import { createHouseholdSchema } from "~/lib/validation";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import TimezonePicker from "~/components/timezone-picker";

export default function OnboardingStepTwo() {
    const { mutate } = useAuthenticationContext();

    return (
        <SafeAreaView className="px-6 flex-1 gap-y-8">
            <Formik
                initialValues={{
                    name: "My Household",
                    timezone: undefined,
                }}
                onSubmit={(values, formikHelpers) => {
                    axios
                        .post('/households', values)
                        .then((r) => {
                            mutate();
                            router.navigate({
                                pathname: '/onboarding/members',
                                params: { household: r.data.data.id }
                            });
                        })
                        .catch((error) => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createHouseholdSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <KeyboardAwareScrollView
                        className="max-w-[500px] mx-auto"
                        contentContainerClassName="flex-grow gap-y-4"
                        showsVerticalScrollIndicator={false}
                        bottomOffset={75}
                    >
                        <View className="gap-y-8">
                            <View className="items-center mt-12 gap-y-4">
                                <Text variant={'h1'}>Name Your Household</Text>
                            </View>

                            <Image
                                style={{ width: '100%', height: 200 }}
                                source={require("~/assets/images/onboarding/step-2.png")}
                                contentFit="contain"
                            />
                            <View className="gap-y-4">
                                <Text variant={'p'} className="text-lg">
                                    Every great household needs a iconic name! Is yours <Text className="text-lg font-semibold">The Glitter Palace</Text> or <Text className="text-lg font-semibold">Couch Potato HQ</Text>? Give it a title that screams <Text className="italic text-lg font-semibold">us</Text> and sets the tone for fun. What name&apos;s calling your heart?
                                </Text>

                                <View className="gap-y-2">
                                    <Label nativeID="name">Name</Label>
                                    <Input nativeID="name" onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name} />
                                    <ErrorMessage name="name" />
                                </View>

                                <View className="gap-y-2">
                                    <Label nativeID="timezone">Timezone</Label>
                                    <TimezonePicker onValueChange={(value) => setFieldValue("timezone", value)} />
                                    <ErrorMessage name="timezone" />
                                </View>
                            </View>
                        </View>

                        <Button className="mt-auto" onPress={() => handleSubmit()}>
                            <Text>Continue</Text>
                        </Button>
                    </KeyboardAwareScrollView>
                )}
            </Formik>
        </SafeAreaView>
    )
}