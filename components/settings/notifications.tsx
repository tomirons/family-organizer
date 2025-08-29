import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";

export default function NotificationsSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle variant={'h3'}>Notifications</CardTitle>
            </CardHeader>

            <CardContent>
                <Text>Content goes here...</Text>
            </CardContent>
        </Card>
    );
}
