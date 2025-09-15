import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Icon from "../ui/icon";
import { deleteMealType, useMealTypes } from "~/hooks/meals";
import { MealType } from "~/types/meal";
import { format } from "date-fns";

export default function MealTypeSettings() {
    const { household } = useAuthenticationContext();
    const { data: mealTypes, isLoading, mutate } = useMealTypes();

    if (isLoading) {
        return null;
    }

    function handleDeleteMealType(id: string): void {
        deleteMealType(household!.id, id)
            .then(() => {
                toast.success("Meal type removed successfully");

                mutate();
            })
            .catch(() => toast.error("Failed to remove meal type"));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle variant={'h3'}>Meal Types</CardTitle>
            </CardHeader>

            <CardContent className="gap-y-1">
                {mealTypes.map((type: MealType) => (
                    <View key={type.id} className="flex-row items-center justify-between">
                        <View className="flex-row gap-x-2">
                            <Text>{type.name}</Text>
                            <Badge variant={'secondary'}>
                                <Text>{format(type.time!, 'h:mm a')}</Text>
                            </Badge>
                        </View>
                        <View className="flex-row gap-x-2">
                            <TouchableOpacity className="p-2" onPress={() => router.push(`/meals/types/form?id=${type.id}`)}>
                                <Icon size={12} className="text-secondary-foreground" icon={byPrefixAndName.fal['pencil']} />
                            </TouchableOpacity>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <TouchableOpacity className="p-2">
                                        <Icon size={12} className="text-destructive" icon={byPrefixAndName.fal['x']} />
                                    </TouchableOpacity>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove the meal type from your household. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            <Text>Cancel</Text>
                                        </AlertDialogCancel>
                                        <AlertDialogAction onPress={() => handleDeleteMealType(type.id!)}>
                                            <Text>Continue</Text>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </View>
                    </View>
                ))}

                <View className="mt-4">
                    <Button variant={'secondary'} onPress={() => router.push('/meals/types/form')}>
                        <Text>Add Meal Type</Text>
                    </Button>
                </View>
            </CardContent>
        </Card>
    );
}