import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, P } from "~/components/ui/typography";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Label } from "~/components/ui/label";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Formik } from "formik";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { isEmpty } from "lodash";
import { toast } from "sonner-native";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { createHouseholdMemberSchema } from "~/lib/validation";

export default function OnboardingStepThree() {
    const { household } = useLocalSearchParams<{ household: string }>();
    const { completeOnboardingFlow } = useAuthenticationContext();

    return (
        <SafeAreaView className="px-6 flex-1 gap-y-8">
            <View className="items-center mt-12 gap-y-4">
                <H1>Add Members</H1>
            </View>

            <Image
                style={{ width: '100%', height: 200 }}
                source={require("~/assets/images/onboarding/step-3.png")}
                contentFit="contain"
            />

            <Formik
                initialValues={{
                    name: undefined,
                    email: undefined,
                }}
                onSubmit={(values, formikHelpers) => {                    
                    axios
                        .post(`/households/${household}/members`, values)
                        .then(() => {
                            toast.success('Member added successfully');
                            formikHelpers.resetForm();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createHouseholdMemberSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <View className="flex-1 justify-between">
                        <View className="gap-y-4">
                            <P className="text-lg">
                                {"Let's round up the gang that makes your home hum! Pop in the names of your humans, furry friends, or even that plant you talk to. The more, the merrier—who's up first?"}
                            </P>

                            <View className="w-full">
                                <Label nativeID="name">Name</Label>
                                <Input className="mt-1" nativeID="name" onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name} />
                                <ErrorMessage name="name" />
                            </View>
                            <View className="w-full">
                                <Label nativeID="email">Email</Label>
                                <Input className="mt-1" nativeID="email" onChangeText={handleChange("email")} onBlur={handleBlur("email")} value={values.email} />
                                <ErrorMessage name="email" />
                            </View>
                        </View>

                        <View className="gap-y-3">
                            <Button onPress={() => handleSubmit()}>
                                <Text>{isEmpty(values.email) ? 'Add' : 'Invite'}</Text>
                            </Button>

                            <Button variant={'secondary'} onPress={() => {
                                completeOnboardingFlow();
                                router.replace('/');
                            }}>
                                <Text>Continue</Text>
                            </Button>
                        </View>
                    </View>
                )}

            </Formik>
        </SafeAreaView>
    )
}