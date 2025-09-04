import { ErrorMessageProps, ErrorMessage as FormikErrorMessage } from 'formik';
import { Platform, TextInput, type TextInputProps } from 'react-native';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const inputClassName = cn(
  'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
  Platform.select({
    web: cn(
      'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
    ),
    native: 'placeholder:text-muted-foreground/50',
  })
);

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        inputClassName,
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        className
      )}
      {...props}
    />
  );
}

function ErrorMessage({ className, ...props }: ErrorMessageProps) {
  return (
    <FormikErrorMessage
      className={cn(
        "text-sm mt-1 text-red-600 dark:text-red-500",
        className,
      )}
      component={Text}
      {...props}
    />
  );
};

export { ErrorMessage, Input, inputClassName };

