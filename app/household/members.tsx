import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { createHouseholdMember, updateHouseholdMember, useHouseholdMembers } from "~/hooks/household";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { createHouseholdMemberSchema } from "~/lib/validation";
import { EmptyHouseholdMember, HouseholdMember } from "~/types/household";

export default function Members() {
    const { household } = useAuthenticationContext();
    const { mutate } = useHouseholdMembers();
    const { id } = useLocalSearchParams();
    const [member, setMember] = useState<HouseholdMember>(EmptyHouseholdMember);
    const { bottom } = useSafeAreaInsets();

    const isCreating = !id;

    useEffect(() => {
        if (!id) return;

        axios.get(`/households/${household?.id}/members/${id}`)
            .then(response => {
                setMember(response.data.data);
            })
            .catch(() => toast.error("Failed to load member"));

    }, [id, household])

    if (!household) {
        return null
    }

    return (
        <SafeAreaView className="flex-1 p-4" edges={['bottom']}>
            <Text variant={'h2'}>{isCreating ? 'Add Member' : 'Edit Member'}</Text>
            <Formik
                enableReinitialize
                initialValues={{
                    name: member.name,
                    email: member.email,
                    is_owner: member.is_owner
                }}
                onSubmit={(values, formikHelpers) => {
                    (
                        isCreating
                            ? createHouseholdMember(household.id, values)
                            : updateHouseholdMember(household.id, member.id, values)
                    )
                        .then(() => {
                            mutate();
                            toast.success(`${isCreating ? 'Member added successfully' : 'Member updated successfully'}`);
                            router.back();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createHouseholdMemberSchema}
            >
                {({ values, handleSubmit, handleBlur, handleChange, setFieldValue }) => (
                    <KeyboardAwareScrollView className="pt-4" contentContainerClassName="flex-1" extraKeyboardSpace={-bottom}>
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
                                    <Text variant={'muted'} className="mt-1">When enabled, this member will be able to manage the household.</Text>
                                </View>
                            )}
                        </View>
                        <View className="flex-row gap-x-2 mt-auto">
                            <Button className="grow" variant="secondary" onPress={() => router.back()}>
                                <Text>Cancel</Text>
                            </Button>
                            <Button className="grow" onPress={() => handleSubmit()}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </Formik>
        </SafeAreaView>
    );
}
