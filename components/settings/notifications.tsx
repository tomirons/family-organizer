import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";

export default function NotificationsSettings() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
            </CardHeader>

            <CardContent>
                <Text>Content goes here...</Text>
            </CardContent>
        </Card>
    );
}
