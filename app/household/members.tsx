import { router } from "expo-router";
import { Formik } from "formik";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { toast } from "sonner-native";
import { useSWRConfig } from "swr";
import { Button } from "~/components/ui/button";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { H2, Muted } from "~/components/ui/typography";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { createHouseholdMemberSchema } from "~/lib/validation";

export default function Members() {
    const { mutate } = useSWRConfig();
    const { household } = useAuthenticationContext();
    
    return (
        <View className="p-4 gap-y-4">
            <H2>Add Member</H2>
            <Formik
                initialValues={{
                    name: undefined,
                    email: undefined,
                    is_owner: false
                }}
                onSubmit={(values, formikHelpers) => {
                    const url = `/households/${household?.id}/members`;
                    
                    axios
                        .post(url, values)
                        .then(() => {
                            mutate(url);
                            toast.success('Member added successfully');
                            router.back();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createHouseholdMemberSchema}
            >
                {({ values, handleSubmit, handleBlur, handleChange, setFieldValue }) => (
                    <KeyboardAwareScrollView className="flex-1">
                        <View className="gap-y-4">
                            <View>
                                <Label nativeID="name">Name</Label>
                                <Input nativeID="name" className="mt-1" placeholder="Name" value={values.name} onBlur={handleBlur('name')} onChangeText={handleChange('name')} />
                                <ErrorMessage name="name" />
                            </View>
                            <View>
                                <Label nativeID="email">Email</Label>
                                <Input nativeID="email" className="mt-1" placeholder="Email" value={values.email} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />
                                <ErrorMessage name="email" />
                            </View>
                            {values.email && (
                                <View>
                                    <Label nativeID="is_owner" className="mb-1">Owner</Label>
                                    <Switch nativeID="is_owner" checked={values.is_owner} onCheckedChange={(value) => setFieldValue('is_owner', value)}></Switch>
                                    <ErrorMessage name="is_owner" />
                                    <Muted className="mt-1">When enabled, this member will be able to manage the household.</Muted>
                                </View>
                            )}
                            <Button onPress={() => handleSubmit()}><Text>Submit</Text></Button>
                            <Button variant="secondary" onPress={() => router.back()}><Text>Cancel</Text></Button>
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </Formik>
        </View>
    );
}
