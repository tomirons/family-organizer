import { Button } from "~/components/ui/button";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  const { logout } = useAuthenticationContext();
  return (
    <View className="flex-1 items-center justify-center">
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
