import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp, FadeOut, FadeOutDown, FadeOutRight, FadeOutUp } from "react-native-reanimated";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import Icon from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { useHouseholdMembers } from "~/hooks/household";
import { createTask, useLists } from "~/hooks/tasks";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import { createTaskSchema } from "~/lib/validation";
import { HouseholdMember } from "~/types/household";

export default function TaskList({ list }: { list: any }) {
    const { household } = useAuthenticationContext();
    const { width } = Dimensions.get('window');
    const [showForm, setShowForm] = useState(false);
    const [showAssigneeSelect, setShowAssigneeSelect] = useState(false);
    const { data: members } = useHouseholdMembers();
    const { mutate: mutateLists } = useLists();

    if (!household) {
        return null;
    }

    return (
        <View key={list.id} style={{ width }} className="p-4 gap-y-3">
            <ScrollView contentContainerClassName="gap-y-2" stickyHeaderIndices={[0]}>
                <View className="bg-background">
                    <Text variant={'h3'}>{list.name}</Text>
                </View>
                {list.tasks.map((task: any) => (
                    <TouchableOpacity
                        key={task.id}
                        onPress={() => {
                            Alert.alert('Task Pressed', `You pressed on task: ${task.title}`);
                        }}
                    >
                        <Card className="px-2 py-3">
                            <CardContent className="px-2 flex-row items-center gap-3">
                                <Checkbox
                                    className="rounded-full size-5"
                                    iconSize={10}
                                    checked={task.is_completed}
                                    onCheckedChange={function (checked: boolean): void {
                                        axios
                                            .post(`households/${household.id}/lists/${list.id}/tasks/${task.id}/${checked ? 'complete' : 'incomplete'}`)
                                            .then(() => {
                                                toast.success(`Marked as ${checked ? 'completed' : 'incomplete'}`);
                                                mutateLists();
                                            });
                                    }}
                                />
                                <Text>{task.title}</Text>
                            </CardContent>
                        </Card>
                    </TouchableOpacity>
                ))}

                {showForm && (
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
                                createTask(household.id, list.id, values)
                                    .then(() => {
                                        mutateLists();
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
                                                        <Button variant={'secondary'} onPress={() => setShowForm(false)}>
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
                )}

                {!showForm && (
                    <Animated.View
                        entering={FadeInUp}
                        exiting={FadeOutDown}
                    >
                        <Button variant={'secondary'} onPress={() => setShowForm(true)}>
                            <Text>Add Task</Text>
                        </Button>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    )
}