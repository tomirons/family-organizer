import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateNewList from "~/components/tasks/create-new-list";
import TaskList from "~/components/tasks/list";
import { Skeleton } from "~/components/ui/skeleton";
import { useLists } from "~/hooks/tasks";

export default function ListsTab() {
    const { data, isLoading } = useLists();
    const showLoadingState = !data && isLoading;

    return (
        <SafeAreaView className="h-full" edges={['top', 'left', 'right']}>
            {showLoadingState ? (
                <View className="p-4 gap-y-3">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </View>
            ) : (
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                    {data.map((list: any) => (
                        <TaskList key={list.id} list={list} />
                    ))}
                    <CreateNewList />
                </ScrollView>
            )}
        </SafeAreaView >
    )
}