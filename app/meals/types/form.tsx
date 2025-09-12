import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { ErrorMessage, Input, inputClassName } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { createMealType, showMealType, updateMealType, useMealTypes } from "~/hooks/meals";
import { handleFormValidation } from "~/lib/form";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";
import { EmptyMealType, MealType } from "~/types/meal";
import { UTCDate } from "@date-fns/utc";
import Animated, {
    FadeIn,
    FadeOut,
} from "react-native-reanimated";
import { createMealTypeSchema } from "~/lib/validation";

export default function MealTypeForm() {
    const [mealType, setMealType] = useState<MealType>(EmptyMealType);
    const { household } = useAuthenticationContext();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { mutate } = useMealTypes();

    const [showTimePicker, setShowTimePicker] = useState(false);

    const isCreating = !id;

    useEffect(() => {
        if (household && id) {
            showMealType(household.id, id)
                .then((res) => {
                    setMealType(res.data.data);
                })
                .catch(() => {
                    toast.error("Failed to load meal type");
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
                    name: mealType.name,
                    time: mealType.time,
                }}
                onSubmit={(values, formikHelpers) => {
                    const payload = {
                        ...values,
                        time: format(new UTCDate(values.time!), 'HH:mm')
                    };

                    (
                        isCreating
                            ? createMealType(household.id, payload)
                            : updateMealType(household.id, id!, payload)
                    )
                        .then(() => {
                            mutate();
                            toast.success(`${isCreating ? 'Meal type added successfully' : 'Meal type updated successfully'}`);
                            router.back();
                        })
                        .catch(error => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={createMealTypeSchema}
            >
                {({ values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
                    <KeyboardAvoidingView
                        className="flex-1 gap-y-4"
                        behavior="padding"
                        keyboardVerticalOffset={100}
                    >
                        <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
                            <Text variant={'h3'}>
                                {isCreating ? 'Create Meal Type' : 'Edit Meal Type'}
                            </Text>
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
                            <Label nativeID="time">Time</Label>
                            <Pressable className={inputClassName} onPress={() => setShowTimePicker(!showTimePicker)}>
                                <Text>{format(new Date(values.time!), 'h:mm a')}</Text>
                            </Pressable>

                            {showTimePicker && (
                                <Animated.View
                                    entering={FadeIn.duration(200)}
                                    exiting={FadeOut.duration(200)}
                                >
                                    <DateTimePicker
                                        value={values.time!}
                                        mode={'time'}
                                        display="spinner"
                                        minuteInterval={15}
                                        onChange={(event, date) => {
                                            setFieldValue('time', date)
                                        }}
                                    />
                                </Animated.View>
                            )}
                            <ErrorMessage name="time" />
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