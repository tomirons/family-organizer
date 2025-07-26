import { View } from "react-native";
import { Text } from "~/components/ui/text";
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

const GuestHeading = ({ children }: { children: React.ReactNode }) => {
    return (
        <Text className="text-3xl font-semibold mb-4 text-center">
            {children}
        </Text>
    )
}
GuestHeading.displayName = "GuestHeading";

const GuestSubHeading = ({ children }: { children: React.ReactNode }) => {
    return (
        <Text className="text-lg text-muted-foreground mb-4 text-center">
            {children}
        </Text>
    )
}
GuestSubHeading.displayName = "GuestSubHeading";

export { GuestLayout, GuestHeading, GuestSubHeading };