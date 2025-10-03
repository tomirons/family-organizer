import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateNewList from "~/components/tasks/create-new-list";
import TaskList from "~/components/tasks/list";
import { Text } from "~/components/ui/text";
import { useLists } from "~/hooks/tasks";

export default function ListsTab() {
    const { data, isLoading } = useLists();

    if (isLoading || !data) {
        return <Text>Loading...</Text>
    }

    return (
        <SafeAreaView className="h-full" edges={['top', 'left', 'right']}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                <CreateNewList />

                {data.map((list: any) => (
                    <TaskList key={list.id} list={list} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}