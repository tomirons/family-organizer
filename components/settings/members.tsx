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
import { useHouseholdMembers } from "~/hooks/household";
import axios from "~/lib/axios";
import { HouseholdMember } from "~/types/household";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Icon from "../ui/icon";

export default function MembersSettings() {
    const { user, household } = useAuthenticationContext();
    const { data: members, isLoading, mutate } = useHouseholdMembers();

    if (isLoading) {
        return null;
    }

    function handleDeleteMember(id: string): void {
        axios
            .delete(`/households/${household?.id}/members/${id}`)
            .then(() => {
                toast.success("Member removed successfully");

                mutate();
            })
            .catch(() => toast.error("Failed to remove member"));
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
                        {user?.id !== member.id && (
                            <View className="flex-row gap-x-2">
                                <TouchableOpacity className="p-2" onPress={() => router.push(`/household/members?id=${member.id}&member=${JSON.stringify(member)}`)}>
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
                                                This will remove the user from your household. You can re-add them again later.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                <Text>Cancel</Text>
                                            </AlertDialogCancel>
                                            <AlertDialogAction onPress={() => handleDeleteMember(member.id)}>
                                                <Text>Continue</Text>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </View>
                        )}
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