import { Formik } from "formik";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { Label } from "~/components/ui/label";
import { ErrorMessage, Input } from "~/components/ui/input";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { createHouseholdSchema } from "~/lib/validation";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangeHouseholdModal() {
    const { mutate } = useAuthenticationContext();

    return (
        <SafeAreaView className="flex-1 p-4 gap-y-4" edges={['bottom']}>
            <Formik
                initialValues={{
                    name: "New Household",
                }}
                onSubmit={(values, formikHelpers) => {
                    axios
                        .post('/households', values)
                        .then((r) => {
                            toast.success("Household successfully created");

                            mutate();

                            router.back();
                        })
                        .catch((error) => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createHouseholdSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <KeyboardAvoidingView
                        behavior="padding"
                        keyboardVerticalOffset={100}
                        className="flex-1 gap-y-4"
                    >
                        <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
                            <Text variant={'h3'}>
                                Create Household
                            </Text>
                        </View>

                        <View className="gap-y-2">
                            <Label nativeID="name">Name</Label>
                            <Input nativeID="name" onChangeText={handleChange("name")} onBlur={handleBlur("name")} value={values.name} />
                            <ErrorMessage name="name" />
                        </View>

                        <Button className="mt-auto" onPress={() => handleSubmit()}>
                            <Text>Submit</Text>
                        </Button>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </SafeAreaView>
    );
}