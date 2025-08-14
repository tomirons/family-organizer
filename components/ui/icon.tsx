import { cn } from "~/lib/utils";
import { FontAwesomeIcon, Props } from "@fortawesome/react-native-fontawesome";
import { cssInterop } from "nativewind";

declare module "@fortawesome/react-native-fontawesome" {
  interface Props {
    className?: string;
  }
}

cssInterop(FontAwesomeIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

export default function Icon({ style, className, ...props }: Props) {
  return (
    <FontAwesomeIcon
      className={cn("fill-current focus-within:outline-none", className)}
      color="currentColor"
      {...props}
    />
  );
}