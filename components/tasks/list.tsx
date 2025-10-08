import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { Formik } from "formik";
import { useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp, FadeOut, FadeOutDown, FadeOutRight, FadeOutUp } from "react-native-reanimated";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Icon from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { useTasksContext } from "~/contexts/tasks-context";
import { useHouseholdMembers } from "~/hooks/household";
import { createTask, useTasks } from "~/hooks/tasks";
import { handleFormValidation } from "~/lib/form";
import { createTaskSchema } from "~/lib/validation";
import { HouseholdMember } from "~/types/household";
import { Task, List } from "~/types/task";
import { Skeleton } from "../ui/skeleton";
import TaskItem from "./item";

export default function TaskList({ list }: { list: List }) {
    const { household } = useAuthenticationContext();
    const { showCompletedTasks, toggleShowCompletedTasks } = useTasksContext();
    const { width } = Dimensions.get('window');
    const [showForm, setShowForm] = useState(false);
    const [showAssigneeSelect, setShowAssigneeSelect] = useState(false);
    const { data: members } = useHouseholdMembers();
    const { data: tasks, isLoading: isTasksLoading, mutate } = useTasks(list.id);

    if (!household || !tasks) {
        return null;
    }

    return (
        <View key={list.id} style={{ width }} className="p-4 gap-y-3">
            <ScrollView contentContainerClassName="gap-y-2" stickyHeaderIndices={[0]}>
                <View className="bg-background flex-row items-center justify-between">
                    <Text variant={'h3'}>{list.name}</Text>
                    <Button variant={'ghost'} onPress={toggleShowCompletedTasks}>
                        <Text>{showCompletedTasks ? 'Hide' : 'Show'} completed</Text>
                    </Button>
                </View>

                {isTasksLoading ? (
                    <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </>
                ) : (
                    tasks.map((task: Task) => (
                        <TaskItem key={task.id} list={list.id} task={task} />
                    ))
                )}

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