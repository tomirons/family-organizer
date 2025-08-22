import { DeviceType, deviceType } from "expo-device";

export const isTablet = deviceType === DeviceType.TABLET;
export const isPhone = deviceType === DeviceType.PHONE;
