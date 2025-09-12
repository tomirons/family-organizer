import { PickerSelectProps } from "react-native-picker-select";
import { SelectPicker } from "./ui/select-picker";

export default function TimezonePicker({ ...props }: Omit<PickerSelectProps, 'items'>) {
    const timezones = [
        { label: "Eastern Time", value: "America/New_York" },
        { label: "Central Time", value: "America/Chicago" },
        { label: "Mountain Time", value: "America/Denver" },
        { label: "Mountain Time (Arizona - No DST)", value: "America/Phoenix" },
        { label: "Pacific Time", value: "America/Los_Angeles" },
        { label: "Alaska Time", value: "America/Anchorage" },
        { label: "Hawaii Time", value: "Pacific/Honolulu" },
        { label: "Atlantic Time (Puerto Rico)", value: "America/Puerto_Rico" },
    ];

    return (
        <SelectPicker
            items={timezones}
            placeholderLabel="Select your timezone"
            {...props}
        />
    );
}