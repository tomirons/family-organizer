import { ErrorMessageProps, ErrorMessage as FormikErrorMessage } from 'formik';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { Text } from '~/components/ui/text';
import { cn } from '~/lib/utils';

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
}) {
  return (
    <TextInput
      className={cn(
        'web:flex h-10 native:h-[2.95rem] web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        props.editable === false && 'opacity-50 web:cursor-not-allowed',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      {...props}
    />
  );
}

function ErrorMessage({ className, ...props }: ErrorMessageProps) {
  return (
    <FormikErrorMessage
      className={cn(
        "mt-1 text-red-600 dark:text-red-500",
        className,
      )}
      component={Text}
      {...props}
    />
  );
};

export { Input, ErrorMessage };
