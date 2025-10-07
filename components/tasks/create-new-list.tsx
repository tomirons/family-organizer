import { Dimensions, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ErrorMessage, Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Formik } from "formik";
import { createList, useLists } from "~/hooks/tasks";
import { createListSchema } from "~/lib/validation";
import { useAuthenticationContext } from "~/contexts/authentication-context";

export default function CreateNewList() {
    const { household } = useAuthenticationContext();
    const width = Dimensions.get('window').width;
    const { mutate } = useLists();

    if (!household) {
        return null;
    }

    return (
        <View style={{ width }} className="px-8">
            <View className="h-full max-w-[500px] justify-center gap-y-10">
                <View className="items-center gap-y-3">
                    <Text variant={'h3'}>New List</Text>
                    <Text className="text-center" variant={'muted'}>
                        Create a new list to organize your tasks. Whether it&apos;s groceries, chores, or a special project, a well-named list keeps everything on track and easy to find.
                    </Text>
                </View>

                <View className="gap-y-6">
                    <Formik
                        initialValues={{ name: undefined }}
                        onSubmit={(values) => {
                            createList(household.id, values).then(() => {
                                mutate();
                            });
                            console.log(values);
                        }}
                        validationSchema={createListSchema}
                    >
                        {({ values, handleChange, handleBlur, handleSubmit }) => (
                            <>
                                <View className="gap-y-1">
                                    <Input
                                        onBlur={handleBlur('name')}
                                        onChangeText={handleChange('name')}
                                        value={values.name}
                                    />
                                    <ErrorMessage name="name" />
                                </View>
                                <Button size={'lg'} onPress={() => handleSubmit()}>
                                    <Text>Create</Text>
                                </Button>
                            </>
                        )}
                    </Formik>
                </View>
            </View>
        </View>
    )
}