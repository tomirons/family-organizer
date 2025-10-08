import { Alert, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";
import { useMarkTaskAs, useTasks } from "~/hooks/tasks";
import { Task } from "~/types/task";

export default function TaskItem({ list, task }: { list: string, task: Task }) {
    const { mutate } = useTasks(list);
    const { trigger, isMutating } = useMarkTaskAs(list);

    return (
        <TouchableOpacity
            key={task.id}
            disabled={isMutating}
            onPress={() => {
                // TODO start here...
                Alert.alert('Task Pressed', `You pressed on task: ${task.title}`);
            }}
        >
            <Card className="px-2 py-3">
                <CardContent className="px-2 flex-row items-center gap-3">
                    <Checkbox
                        className="rounded-full size-5"
                        iconSize={10}
                        checked={task.is_completed}
                        disabled={isMutating}
                        onCheckedChange={function (checked: boolean): void {
                            trigger({ id: task.id, checked: checked })
                                .then(() => {
                                    toast.success(`Marked as ${checked ? 'completed' : 'incomplete'}`);
                                    mutate();
                                });
                        }} />
                    <Text>{task.title}</Text>
                </CardContent>
            </Card>
        </TouchableOpacity>
    );
}