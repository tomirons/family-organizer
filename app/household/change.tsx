import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { useAuthenticationContext } from "~/contexts/authentication-context";

export default function ChangeHouseholdModal() {
    const { user, households } = useAuthenticationContext();

    return (
        <View className="p-4 gap-y-4">
            <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
                <H3>
                    Select Household
                </H3>
                <Button onPress={() => router.push('/household/create')}>
                    <Text>Create</Text>
                </Button>
            </View>

            <ScrollView contentContainerClassName="h-full gap-y-4">
                {households.map((household) => (
                    <TouchableOpacity key={household.id} activeOpacity={0.5}>
                        <Card>
                            <CardHeader>
                                <Text>{household.name}</Text>
                            </CardHeader>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}