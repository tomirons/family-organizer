import { Dimensions, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Formik } from "formik";

export default function CreateNewList() {
    const width = Dimensions.get('window').width;

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
                            console.log(values);
                        }}
                    >
                        {({ values, handleChange, handleBlur, handleSubmit }) => (
                            <>
                                <Input
                                    onBlur={handleBlur('name')}
                                    onChangeText={handleChange('name')}
                                    value={values.name}
                                />
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