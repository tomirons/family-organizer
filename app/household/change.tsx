import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import axios from "~/lib/axios";
import { toast } from "sonner-native";

export default function ChangeHouseholdModal() {
    const { households, setHousehold } = useAuthenticationContext();

    return (
        <View className="flex-1 p-4">
            <View className="flex-row justify-between items-center pb-2 border-b border-border">
                <Text variant={'h3'}>
                    Select Household
                </Text>
                <Button onPress={() => router.push('/household/create')}>
                    <Text>Create</Text>
                </Button>
            </View>

            <ScrollView className="flex-1 pt-4" contentContainerClassName="gap-y-4">
                {households.map((household) => (
                    <TouchableOpacity key={household.id} activeOpacity={0.5} onPress={() => {
                        setHousehold(household);

                        axios.post('/settings/household', { id: household.id })
                            .then(() => {
                                toast.success(`Switched to ${household.name}`);

                                router.back();
                            })
                            .catch(() => {
                                toast.error("Failed to switch household. Please try again.");
                            });
                    }}>
                        <Card>
                            <CardHeader className="flex-row items-center gap-x-4">
                                <Avatar className="size-10" alt={"Household Avatar"}>
                                    <AvatarImage source={{ uri: household?.avatar_url }} />
                                </Avatar>
                                <CardTitle className="text-lg">{household.name}</CardTitle>
                            </CardHeader>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}