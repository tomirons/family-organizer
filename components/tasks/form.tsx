import { Formik } from "formik";
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeOut, FadeOutRight, FadeOutUp } from "react-native-reanimated";
import { toast } from "sonner-native";
import { createTask, useTasks } from "~/hooks/tasks";
import { handleFormValidation } from "~/lib/form";
import { createTaskSchema } from "~/lib/validation";
import { HouseholdMember } from "~/types/household";
import { Card } from "~/components/ui/card";
import { TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { useState } from "react";
import { useHouseholdMembers } from "~/hooks/household";
import { useAuthenticationContext } from "~/contexts/authentication-context";

export default function TaskForm({ list, onCancel }: { list: string, onCancel: () => void }) {
    const { household } = useAuthenticationContext();
    const [showAssigneeSelect, setShowAssigneeSelect] = useState(false);
    const { data: members } = useHouseholdMembers();
    const { mutate } = useTasks(list);

    if (!household) {
        return null;
    }

    return (
        <Animated.View
            entering={FadeInDown}
            exiting={FadeOutUp}
        >
            <Formik
                initialValues={{
                    title: undefined,
                    assignee_id: undefined,
                }}
                onSubmit={(values, formikHelpers) => {
                    createTask(household.id, list, values)
                        .then(() => {
                            mutate();
                            toast.success(`${true ? 'Task added successfully' : 'Task updated successfully'}`);
                            formikHelpers.resetForm();
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
                        <Card className="px-2 py-2 gap-2">
                            <View>
                                <Input
                                    className="border-0 shadow-none"
                                    placeholder="Enter task..."
                                    value={values.title}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                />
                            </View>
                            <View className="flex-row gap-x-2">
                                {showAssigneeSelect && (
                                    <>
                                        <TouchableOpacity className="p-3" onPress={() => setShowAssigneeSelect(false)}>
                                            <Icon icon={byPrefixAndName.fal['x']} size={10} className="text-primary" />
                                        </TouchableOpacity>
                                        <Animated.ScrollView
                                            entering={FadeIn}
                                            exiting={FadeOut}
                                            horizontal
                                            contentContainerClassName="flex-row items-center gap-x-1"
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            {members.map((member: HouseholdMember) => (
                                                <Button
                                                    key={member.id}
                                                    variant={'secondary'}
                                                    size={'sm'}
                                                    onPress={() => handleAssigneeSelected(member)}
                                                >
                                                    <Text>{member.name}</Text>
                                                </Button>
                                            ))}
                                        </Animated.ScrollView>
                                    </>
                                )}
                                {!showAssigneeSelect && (
                                    <>
                                        {values.assignee_id ? (
                                            <Animated.View key={`assignee-${values.assignee_id}`} className={'flex-row'} entering={FadeInLeft} exiting={FadeOutRight}>
                                                <TouchableOpacity className="p-3" onPress={() => setFieldValue('assignee_id', undefined)}>
                                                    <Icon icon={byPrefixAndName.fal['x']} size={10} className="text-primary" />
                                                </TouchableOpacity>
                                                <Button size={'sm'} variant={'secondary'} onPress={() => setShowAssigneeSelect(true)}>
                                                    <Icon icon={byPrefixAndName.fal['user']} size={10} className="text-secondary-foreground" />
                                                    <Text>{members.find((member: HouseholdMember) => member.id === values.assignee_id).name}</Text>
                                                </Button>
                                            </Animated.View>
                                        ) : (
                                            <Animated.View key="assignee-none" entering={FadeInLeft} exiting={FadeOutRight}>
                                                <Button size={'sm'} variant={'secondary'} onPress={() => setShowAssigneeSelect(true)}>
                                                    <Icon icon={byPrefixAndName.fal['user']} size={10} className="text-secondary-foreground" />
                                                    <Text>Assignee</Text>
                                                </Button>
                                            </Animated.View>
                                        )}
                                        <Animated.View entering={FadeIn} exiting={FadeOut} className="ml-auto flex-row gap-x-2">
                                            <Button variant={'secondary'} onPress={() => {onCancel()}}>
                                                <Text>Cancel</Text>
                                            </Button>
                                            <Button onPress={() => handleSubmit()} disabled={!values.title}>
                                                <Text>Save</Text>
                                            </Button>
                                        </Animated.View>
                                    </>
                                )}
                            </View>
                        </Card>
                    );
                }}
            </Formik>
        </Animated.View>
    )
}