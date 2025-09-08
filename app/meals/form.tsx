import { byPrefixAndName } from "@awesome.me/kit-5314873f9e/icons";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import Icon from "~/components/ui/icon";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SelectPicker } from "~/components/ui/select-picker";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { createMeal, showMeal, updateMeal, useMeals, useMealTypes } from "~/hooks/meals";
import { handleFormValidation } from "~/lib/form";
import { createMealSchema } from "~/lib/validation";
import { EmptyMeal, Meal } from "~/types/meal";

export default function MealForm() {
    const [meal, setMeal] = useState<Meal>(EmptyMeal);
    const { household } = useAuthenticationContext();
    const { date, id } = useLocalSearchParams<{ date: string, id?: string }>();
    const { mutate } = useMeals();

    const { data: mealTypes, isLoading } = useMealTypes();

    const types = map(mealTypes, (i) => ({
        label: i.name,
        value: i.id
    }));

    const isCreating = !id;

    useEffect(() => {
        if (household && id) {
            showMeal(household!.id, id!)
                .then((res) => {
                    setMeal(res.data.data);
                })
                .catch(() => {
                    toast.error("Failed to load meal");
                });
        }
    }, [household, id]);

    if (!household) {
        return null;
    }

    return (
        <SafeAreaView className="flex-1 p-4 gap-y-4" edges={['bottom']}>
            <Formik
                enableReinitialize
                initialValues={{
                    date: date,
                    type_id: meal.type_id,
                    name: meal.name,
                    notes: meal.notes,
                }}
                onSubmit={(values, formikHelpers) => {
                    (
                        isCreating
                            ? createMeal(household.id, values)
                            : updateMeal(household.id, id, values)
                    )
                        .then(() => {
                            mutate();
                            toast.success(`${isCreating ? 'Meal added successfully' : 'Meal updated successfully'}`);
                            router.back();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createMealSchema}
            >
                {({ values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
                    <KeyboardAvoidingView
                        className="flex-1 gap-y-4"
                        behavior="padding"
                        keyboardVerticalOffset={100}
                    >
                        <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
                            <Text variant={'h3'}>
                                {isCreating ? 'Create Meal' : 'Edit Meal'}
                            </Text>
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="date">Date</Label>
                            <Input
                                nativeID="date"
                                value={format(new UTCDate(values.date), 'EEEE, MMMM d')}
                                editable={false}
                            />
                            <ErrorMessage name="date" />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="name">Name</Label>
                            <Input
                                nativeID="name"
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                            />
                            <ErrorMessage name="name" />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="type">Type</Label>
                            <View className="flex-row gap-x-1">
                                <View className="flex-1">
                                    <SelectPicker
                                        placeholderLabel="Select a meal type..."
                                        disabled={isLoading}
                                        onValueChange={(value) => setFieldValue('type_id', value)}
                                        items={types}
                                    />
                                </View>
                                <Button variant={'secondary'} size={'icon'} onPress={() => router.push('/meals/types/form')}>
                                    <Icon size={12} icon={byPrefixAndName.fal['plus']} className='text-secondary-foreground' />
                                </Button>
                            </View>
                            <ErrorMessage name="type_id" />
                        </View>

                        <View className="gap-y-1">
                            <Label nativeID="notes">Notes</Label>
                            <Textarea
                                nativeID="notes"
                                value={values.notes}
                                onChangeText={handleChange('notes')}
                                onBlur={handleBlur('notes')}
                            />
                            <ErrorMessage name="notes" />
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