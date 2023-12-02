import { FC, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { createNotification } from "../../api/api";
import { RequestWithImg } from "../../hooks/use-requests";
import { SessionContext } from "../../context/SessionContext";
import dayjs from "../../dayjsWithLocale";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "@rneui/themed";
import { UseMutateFunction } from "@tanstack/react-query";

interface RequestProps {
  request: RequestWithImg;
  approveMutation: UseMutateFunction<
    void,
    Error,
    {
      requestId: number;
      userId: string;
    },
    unknown
  >;
  isApprovePending: boolean;
}

export const PostRequest: FC<RequestProps> = ({
  request,
  approveMutation,
  isApprovePending,
}) => {
  const { session } = useContext(SessionContext);
  const { t } = useTranslation();
  const navigation: NavigationProp<any> = useNavigation();
  const treeGetter = request?.profiles;

  const onCardPress = () => {
    if (request.approved) {
      navigation.navigate("Chat", {
        requestId: request.id,
        recipientProfile: treeGetter,
      });
    }
  };

  return (
    <TouchableOpacity onPress={onCardPress} disabled={!request.approved}>
      <View
        style={{
          height: 90,
        }}
      >
        <View
          style={{
            paddingHorizontal: 5,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 0.5, padding: 10 }}>
            <Image
              style={{
                height: "100%",
                borderRadius: 100,
              }}
              source={{ uri: `${request?.image_url}?height=350&width=350` }}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text>{treeGetter?.first_name}</Text>
            <Text>{dayjs(request.created_at).format("ll").toString()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            {request.approved ? (
              <Ionicons name="chatbubbles" color="green" size={40} />
            ) : (
              <TouchableOpacity
                disabled={isApprovePending}
                style={{
                  backgroundColor: "green",
                  borderRadius: 24,
                  minWidth: 100,
                  alignItems: "center",
                }}
                onPress={() => {
                  approveMutation({
                    requestId: request.id!,
                    userId: session?.user?.id!,
                  });
                  createNotification(
                    request.profiles?.id!,
                    t("RequestApprovedNotificationTitle"),
                    t("RequestApprovedNotificationBody")
                  );
                }}
              >
                <Text
                  style={{
                    color: "white",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                >
                  {request.approved
                    ? t("postRequestButtonApproved")
                    : t("postRequestApproveButton")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
