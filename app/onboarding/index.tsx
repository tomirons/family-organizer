import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, P } from "~/components/ui/typography";
import { router } from "expo-router";
import { Image } from "~/components/image";

export default function OnboardingStepOne() {
    return (
        <SafeAreaView className="px-6 flex-1 gap-y-8">
            <View className="items-center mt-12 gap-y-4">
                <H1>Welcome to Nestly!</H1>
            </View>

            <Image
                style={{ width: '100%', height: 200 }}
                source={require("~/assets/images/onboarding/step-1.png")}
                contentFit="contain"
            />

            <View className="flex-1 justify-between max-w-[500px] mx-auto">
                <P className="text-lg">
                    {"Welcome to your new home command center! This app is your trusty sidekick for keeping life organized and stress-free. Buckle up for a quick setup, and let’s make your household shine brighter than a disco ball!"}
                </P>
                <Button onPress={() => router.navigate('/onboarding/household')}>
                    <Text>Continue</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}