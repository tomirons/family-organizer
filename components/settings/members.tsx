import { TouchableOpacity, View } from "react-native";
import useSWR from "swr";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";
import { Badge } from "../ui/badge";
import Icon from "../ui/icon";
import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { router } from "expo-router";
import { HouseholdMember } from "~/types/household";

export default function MembersSettings() {
    const { household } = useAuthenticationContext();
    const { data: members, isLoading } = useSWR(
        `/households/${household?.id}/members`,
        (url) => axios.get(url).then((res) => res.data.data)
    );

    if (isLoading) {
        return null;
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Members</CardTitle>
            </CardHeader>

            <CardContent>
                {members.map((member: HouseholdMember) => (
                    <View key={member.id} className="flex-row items-center justify-between">
                        <View className="flex-row">
                            <Text>{member.name}</Text>
                            {member.is_owner && (
                                <Badge variant="secondary" className="ml-2">
                                    <Text>owner</Text>
                                </Badge>
                            )}
                        </View>
                        <View className="flex-row gap-x-2">
                            <TouchableOpacity className="p-2">
                                <Icon size={12} className="text-secondary-foreground" icon={byPrefixAndName.fal['pencil']} />
                            </TouchableOpacity>
                            <TouchableOpacity className="p-2">
                                <Icon size={12} className="text-destructive" icon={byPrefixAndName.fal['x']} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View className="mt-4">
                    <Button variant={'secondary'} onPress={() => router.push('/household/members')}>
                        <Text>Add Member</Text>
                    </Button>
                </View>
            </CardContent>
        </Card>
    );
}