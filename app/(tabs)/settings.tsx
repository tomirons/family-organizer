import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { H2 } from "~/components/ui/typography";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import AccountSettings from "~/components/settings/account";
import PasswordSettings from "~/components/settings/password";
import NotificationsSettings from "~/components/settings/notifications";
import MembersSettings from "~/components/settings/members";

export default function SettingsTab() {
  const { user, household } = useAuthenticationContext();

  const sections = [
    { id: 'account', title: 'Account', content: <AccountSettings /> },
    { id: 'password', title: 'Password', content: <PasswordSettings /> },
    { id: 'notifications', title: 'Notifications', content: <NotificationsSettings /> },
    { id: 'members', title: 'Members', content: <MembersSettings /> },
  ]

  return (
    <>
      <SafeAreaView className="px-8 pt-10 gap-y-4">
        <View className="flex-row items-center justify-between">
          <H2 className="border-0">{user?.name}</H2>
          <Link href="/household/change" asChild>
            <TouchableOpacity activeOpacity={0.5}>
              <Card className="shadow-none">
                <CardHeader className="flex-row items-center gap-x-2 px-3 py-2">
                  <Avatar className="size-7" alt={"Household Avatar"}>
                    <AvatarImage source={{ uri: household?.avatar_url }} />
                  </Avatar>
                  <CardTitle className="text-base">{household?.name}</CardTitle>
                </CardHeader>
              </Card>
            </TouchableOpacity>
          </Link>
        </View>

        <FlatList
          data={sections}
          className="h-full"
          contentContainerClassName="gap-4"
          renderItem={({ item }) => item.content}
        >

        </FlatList>
      </SafeAreaView>
    </>
  );
}