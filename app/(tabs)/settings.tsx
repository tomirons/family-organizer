import { Link } from "expo-router";
import { get } from "lodash";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountSettings from "~/components/settings/account";
import MealTypeSettings from "~/components/settings/meal-types";
import MembersSettings from "~/components/settings/members";
import PasswordSettings from "~/components/settings/password";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { isTablet } from "~/hooks/useDevice";
import { cn } from "~/lib/utils";

export default function SettingsTab() {
  const { user, household } = useAuthenticationContext();

  const isOwner = get(user, 'household.is_owner');

  const sections = [
    { id: 'account', title: 'Account', content: <AccountSettings />, visible: true },
    { id: 'password', title: 'Password', content: <PasswordSettings />, visible: true },
    // { id: 'notifications', title: 'Notifications', content: <NotificationsSettings />, visible: true },
    { id: 'members', title: 'Members', content: <MembersSettings />, visible: isOwner },
    { id: 'meal-types', title: 'Meal Types', content: <MealTypeSettings />, visible: isOwner },
  ].filter(section => section.visible);

  return (
    <SafeAreaView className={cn("flex-1", isTablet && "pt-6")} edges={['top', 'left', 'right']}>
      <View className="flex-row items-center justify-between border-b border-border pb-4 px-6">
        <Text variant={'h2'} className="border-0">{user?.name}</Text>
        <Link href="/household/change" asChild>
          <TouchableOpacity activeOpacity={0.5}>
            <Card className="shadow-none py-0">
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
        className="flex-1"
        contentContainerClassName="gap-4 py-4 px-6"
        renderItem={({ item }) => item.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}