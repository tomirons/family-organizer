import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { map } from "lodash";
import { SelectPicker } from "~/components/ui/select-picker";
import { Textarea } from "~/components/ui/textarea";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { toast } from "sonner-native";
import { createMeal, useMeals, useMealTypes } from "~/hooks/meals";
import { handleFormValidation } from "~/lib/form";

export default function CreateMeal() {
    const { household } = useAuthenticationContext();
    const { date } = useLocalSearchParams<{ date: string }>();
    const { mutate } = useMeals();

    const { data: mealTypes, isLoading } = useMealTypes();

    const types = map(mealTypes, (i) => ({
        label: i.name,
        value: i.id
    }));

    if (!household) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 p-4 gap-y-4" edges={['bottom']}>
            <Formik
                initialValues={{
                    date: date,
                    type_id: undefined,
                    name: undefined,
                    notes: undefined,
                }}
                onSubmit={(values, formikHelpers) => {
                    createMeal(household.id, values)
                        .then(() => {
                            mutate();
                            toast.success(`${true ? 'Meal added successfully' : 'Meal updated successfully'}`);
                            router.back();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
            >
                {({ values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
                    <KeyboardAvoidingView className="flex-1 gap-y-4">
                        <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
                            <Text variant={'h3'}>
                                Create Meal
                            </Text>
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="date">Date</Label>
                            <Input
                                nativeID="date"
                                value={format(new UTCDate(values.date), 'EEEE, MMMM d')}
                                editable={false}
                            />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="name">Name</Label>
                            <Input
                                nativeID="name"
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                            />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="type">Type</Label>
                            <SelectPicker
                                placeholderLabel="Select a meal type..."
                                disabled={isLoading}
                                onValueChange={(value) => setFieldValue('type_id', value)}
                                items={types}
                            />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="notes">Notes</Label>
                            <Textarea
                                nativeID="notes"
                                value={values.notes}
                                onChangeText={handleChange('notes')}
                                onBlur={handleBlur('notes')}
                            />
                        </View>

                        <Button className="mt-auto" onPress={() => handleSubmit()}>
                            <Text>Submit</Text>
                        </Button>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </SafeAreaView>
    );
}