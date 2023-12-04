import { FC, MutableRefObject, RefObject, useRef } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface SwipeToDeleteRequestProps {
  children: JSX.Element;
  openedRow: MutableRefObject<Swipeable | null>;
  deleteRequest: () => void;
}

const SwipeToDeleteRequest: FC<SwipeToDeleteRequestProps> = ({
  children,
  openedRow,
  deleteRequest,
}) => {
  const { t } = useTranslation();

  const onDelete = (swipeable: Swipeable) => {
    return Alert.alert(t("deleteRequestTitle"), t("deleteRequestMessage"), [
      {
        text: t("cancel"),
        style: "cancel",
        onPress: () => swipeable.close(),
      },
      {
        text: t("deleteRequest"),
        onPress: () => {
          swipeable.close();
          deleteRequest();
        },
      },
    ]);
  };

  const renderRightActions = (
    progress: any,
    dragAnimatedValue: any,
    swipeable: any
  ) => {
    const translateX = dragAnimatedValue.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 90],
    });
    return (
      <Animated.View style={{ transform: [{ translateX }] }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#D3D3D3",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: "100%",
          }}
          onPress={() => onDelete(swipeable)}
        >
          <Ionicons name="trash-outline" size={30} color="black" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      onSwipeableWillOpen={() => openedRow.current?.close()} // Close a previously opened row
      onSwipeableOpen={(_, swipeable) => (openedRow.current = swipeable)} // Keep a link to the currently opened row
      onSwipeableWillClose={() => (openedRow.current = null)}
      renderRightActions={(progress, dragAnimatedValue, swipeable) =>
        renderRightActions(progress, dragAnimatedValue, swipeable)
      }
    >
      {children}
    </Swipeable>
  );
};

export default SwipeToDeleteRequest;
