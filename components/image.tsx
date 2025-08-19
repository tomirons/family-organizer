import { Image as ExpoImage, ImageProps } from "expo-image";
import { cssInterop } from "nativewind";
import { JSX } from "react";

const Component = cssInterop(ExpoImage, {
    className: "style",
});

function Image(props: JSX.IntrinsicAttributes & ImageProps & { readonly className?: string | undefined; }) {
    return <Component {...props} />;
}

export { Image };
