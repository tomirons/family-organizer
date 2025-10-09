import { Dimensions, ScrollView, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { useTasksContext } from "~/contexts/tasks-context";
import { useTasks } from "~/hooks/tasks";
import { Task, List } from "~/types/task";
import { Skeleton } from "../ui/skeleton";
import TaskItem from "./item";
import { router } from "expo-router";

export default function TaskList({ list }: { list: List }) {
    const { household } = useAuthenticationContext();
    const { showCompletedTasks, toggleShowCompletedTasks } = useTasksContext();
    const { width } = Dimensions.get('window');
    const { data: tasks, isLoading: isTasksLoading } = useTasks(list.id);

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

                <Animated.View
                    entering={FadeInUp}
                    exiting={FadeOutDown}
                >
                    <Button variant={'secondary'} onPress={() => router.push(`/tasks/form?list=${list.id}`)}>
                        <Text>Add Task</Text>
                    </Button>
                </Animated.View>
            </ScrollView>
        </View>
    )
}