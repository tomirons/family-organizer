import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthenticationContext } from "~/contexts/authentication-context";
import { Text } from "~/components/ui/text";
import { H3, H2 } from "~/components/ui/typography";
import { useCallback, useRef } from "react";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useThemeColor } from "~/hooks/useThemeColor";
import { Card, CardHeader } from "~/components/ui/card";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import { TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

export default function SettingsTab() {
  const { user, households } = useAuthenticationContext();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { bottom: safeBottomArea } = useSafeAreaInsets();

  const { isDarkColorScheme } = useColorScheme();
  const backdropColor = useThemeColor('foreground');

  const backdropRender = useCallback((props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      opacity={isDarkColorScheme ? 0.1 : 0.5}
      style={{ backgroundColor: backdropColor }}
    />
  ), [isDarkColorScheme, backdropColor]);

  return (
    <>
      <SafeAreaView className="px-8 pt-10">
        <View className="flex-row items-center justify-between">
          <H2 className="border-0">{user?.name}</H2>
          <Link href="/household/change">
            Open modal
          </Link>
          <TouchableOpacity onPress={handlePresentModalPress}>
            {/* <Badge variant={'secondary'}> */}
            <Text className="text-lg">Change Household</Text>
            {/* </Badge> */}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <BottomSheetModal
        backgroundStyle={{
          backgroundColor: useThemeColor("background"),
        }}
        handleIndicatorStyle={{
          backgroundColor: useThemeColor("foreground"),
        }}
        backdropComponent={backdropRender}
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={['25%', '50%']}
        containerStyle={{ marginHorizontal: 100 }}
      >
        <BottomSheetScrollView
          className="px-8 mt-2"
          contentContainerClassName="gap-y-4"
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingBottom: safeBottomArea }}
        >
          <View className="flex-row justify-between items-center border-b border-border pb-2 bg-background">
            <H3>
              Select Household
            </H3>
            <Button><Text>Create</Text></Button>
          </View>

          {households.map((household) => (
            <TouchableOpacity key={household.id} activeOpacity={0.5}>
              <Card>
                <CardHeader>
                  <Text>{household.name}</Text>
                </CardHeader>
              </Card>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}