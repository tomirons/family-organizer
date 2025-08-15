import { Formik } from "formik";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import axios from "~/lib/axios";
import { handleFormValidation } from "~/lib/form";
import * as Yup from 'yup';

export default function ChangeHouseholdModal() {
    const { user } = useAuthenticationContext();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required().label('Name'),
    });

    return (
        <View className="p-4 gap-y-4">
            <Formik
                initialValues={{
                    name: "My Household",
                }}
                onSubmit={(values, formikHelpers) => {
                    axios
                        .post('/households', values)
                        .then((r) => {
                            // router.navigate({
                            //     pathname: '/onboarding/members',
                            //     params: { household: r.data.data.id }
                            // });
                        })
                        .catch((error) => handleFormValidation(error, formikHelpers));
                }}
                validationSchema={validationSchema}
            >
                <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
                    <H3>
                        Create Household
                    </H3>
                    <Button>
                        <Text>Submit</Text>
                    </Button>
                </View>
            </Formik>
        </View>
    );
}