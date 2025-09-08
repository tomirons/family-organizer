import { useColorScheme } from "~/lib/useColorScheme";
import { useThemeColor } from "~/hooks/useThemeColor";
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import { inputClassName } from "~/components/ui/input";

function SelectPicker({ style, placeholderLabel, ...props }: PickerSelectProps & { placeholderLabel?: string }) {
    const { isDarkColorScheme } = useColorScheme();
    const placeHolderColor = useThemeColor('muted-foreground');

    return (
        <RNPickerSelect
            darkTheme={isDarkColorScheme}
            placeholder={{
                label: placeholderLabel ?? 'Select an option...',
                value: undefined,
                color: placeHolderColor
            }}
            textInputProps={{
                className: inputClassName,
            }}
            style={{
                inputIOSContainer: { pointerEvents: "none"},
                ...style
            }}
            {...props}
        />
    )
}

export { SelectPicker };