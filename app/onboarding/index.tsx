import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1 } from "~/components/ui/typography";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function OnboardingStepOne() {
    return (
        <SafeAreaView className="px-6 flex-1 gap-y-16">
            <View className="items-center mt-24 gap-y-4">
                <H1>Welcome to Nestly!</H1>
            </View>

            <Image
                style={{ width: '100%', height: 300 }}
                source={require("~/assets/images/onboarding/step-1.png")}
                contentFit="contain"
            />

            <View className="flex-1 justify-between">
                <Text>First you&apos;ll get to create a household. This will allow you to add members to your home and manage your household settings.</Text>

                <Button onPress={() => router.push('/onboarding/household')}>
                    <Text>Continue</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}