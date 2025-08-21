import { SafeAreaView } from "react-native-safe-area-context";
import { H2 } from "~/components/ui/typography";

export default function MealsTab() {
    return (
        <SafeAreaView className="px-8 pt-10 gap-y-4">
            <H2>Meal Plan</H2>
        </SafeAreaView>
    )
}