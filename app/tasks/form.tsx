import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInLeft, FadeOut, FadeOutRight } from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { useHouseholdMembers } from "~/hooks/household";
import { createTask, useTasks } from "~/hooks/tasks";
import { handleFormValidation } from "~/lib/form";
import { createTaskSchema } from "~/lib/validation";
import { HouseholdMember } from "~/types/household";

export default function TaskForm() {
    const { household } = useAuthenticationContext();
    const { list } = useLocalSearchParams<{ list: string }>();
    const [showAssigneeSelect, setShowAssigneeSelect] = useState(false);
    const { data: members } = useHouseholdMembers();
    const { mutate } = useTasks(list);

    if (!household) {
        return null;
    }

    return (
        <View className="flex-1 p-4 gap-y-4 mt-4">
            <Formik
                initialValues={{
                    title: undefined,
                    assignee_id: undefined,
                }}
                onSubmit={(values, formikHelpers) => {
                    createTask(household.id, list, values)
                        .then(() => {
                            mutate();
                            toast.success('Task added successfully');
                            router.back();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createTaskSchema}
            >
                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
                    const handleAssigneeSelected = (member: HouseholdMember) => {
                        setFieldValue('assignee_id', member.id);
                        setShowAssigneeSelect(false);
                    }

                    return (
                        <KeyboardAvoidingView
                            behavior="padding"
                            keyboardVerticalOffset={100}
                            className="flex-1 gap-y-4"
                        >
                            <View className="gap-y-1">
                                <Input
                                    nativeID="title"
                                    placeholder="Enter task..."
                                    value={values.title}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    autoFocus
                                />
                                <ErrorMessage name="title" />
                            </View>

                            <View className="gap-y-1">
                                {showAssigneeSelect ? (
                                    <Animated.View className="flex-row items-center gap-x-2" 
                                         entering={FadeIn}
                                            exiting={FadeOut}>
                                        <TouchableOpacity className="p-3" onPress={() => setShowAssigneeSelect(false)}>
                                            <Icon icon={byPrefixAndName.fal['x']} size={10} className="text-primary" />
                                        </TouchableOpacity>
                                        <ScrollView
                                            horizontal
                                            contentContainerClassName="flex-row items-center gap-x-2"
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            {members.map((member: HouseholdMember) => (
                                                <Button
                                                    key={member.id}
                                                    variant={'secondary'}
                                                    onPress={() => handleAssigneeSelected(member)}
                                                >
                                                    <Text>{member.name}</Text>
                                                </Button>
                                            ))}
                                        </ScrollView>
                                    </Animated.View>
                                ) : (
                                    <View className="flex-row gap-x-2">
                                        {values.assignee_id ? (
                                            <Animated.View key={`assignee-${values.assignee_id}`} className="flex-row gap-x-2" entering={FadeInLeft} exiting={FadeOutRight}>
                                                <TouchableOpacity className="p-3" onPress={() => setFieldValue('assignee_id', undefined)}>
                                                    <Icon icon={byPrefixAndName.fal['x']} size={10} className="text-primary" />
                                                </TouchableOpacity>
                                                <Button variant={'secondary'} onPress={() => setShowAssigneeSelect(true)}>
                                                    <Icon icon={byPrefixAndName.fal['user']} size={16} className="text-secondary-foreground" />
                                                    <Text>{members.find((member: HouseholdMember) => member.id === values.assignee_id).name}</Text>
                                                </Button>
                                            </Animated.View>
                                        ) : (
                                            <Animated.View key="assignee-none" entering={FadeInLeft} exiting={FadeOutRight}>
                                                <Button variant={'secondary'} onPress={() => setShowAssigneeSelect(true)}>
                                                    <Icon icon={byPrefixAndName.fal['user']} size={16} className="text-secondary-foreground" />
                                                    <Text>Select assignee</Text>
                                                </Button>
                                            </Animated.View>
                                        )}

                                        <Animated.View entering={FadeInLeft} exiting={FadeOutRight} className="ml-auto">
                                            <Button className="ml-auto" onPress={() => handleSubmit()} disabled={!values.title}>
                                                <Text>Submit</Text>
                                            </Button>
                                        </Animated.View>
                                    </View>
                                )}
                            </View>
                        </KeyboardAvoidingView>
                    );
                }}
            </Formik>
        </View>
    );
}
