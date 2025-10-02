import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";
import axios from "~/lib/axios";

export default function ListsTab() {
    const { data, isLoading } = useSWR('households/1/lists?include=tasks', (url) => axios.get(url).then((res) => res.data.data));
    const { width } = Dimensions.get('window');

    if (isLoading || !data) {
        return <Text>Loading...</Text>
    }

    return (
        <SafeAreaView className="h-full">
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {data.map((list: any) => (
                    <View key={list.id} style={{ width }} className="p-4 gap-y-3">
                        <Text variant={'h3'}>{list.name}</Text>
                        <ScrollView contentContainerClassName="gap-y-3">
                            {list.tasks.map((task: any) => (
                                <Card key={task.id} className="px-2 py-3">
                                    <CardContent className="px-2 flex-row items-center gap-3">
                                        <Checkbox checked={task.is_completed} onCheckedChange={function (checked: boolean): void {
                                            throw new Error("Function not implemented.");
                                        } } />
                                        <Text>{task.title}</Text>
                                    </CardContent>
                                </Card>
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}