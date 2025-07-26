import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { H1 } from "~/components/ui/typography";
import { SafeAreaView } from "react-native-safe-area-context";

const GuestLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaView>
            <View className="m-3 mt-12">
                <Text className="text-center my-10">LOGO</Text>
                {children}
            </View>
        </SafeAreaView>
    )
}
GuestLayout.displayName = "GuestLayout";

const GuestHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <H1 className="mb-4 text-center">
            {children}
        </H1>
    )
}
GuestHeader.displayName = "GuestHeader";

export { GuestLayout, GuestHeader }