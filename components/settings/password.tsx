import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";

export default function PasswordSettings() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Password</CardTitle>
            </CardHeader>

            <CardContent>
                <Text>Content goes here...</Text>
            </CardContent>
        </Card>
    );
}
