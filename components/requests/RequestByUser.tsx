import { FC } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { RequestMadeByUser } from "../../api/api";
import dayjs from "../../dayjsWithLocale";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "@rneui/themed";

interface RequestByUserProps {
  request: RequestMadeByUser;
}

export const RequestByUser: FC<RequestByUserProps> = ({ request }) => {
  const { t } = useTranslation();
  const navigation: NavigationProp<any> = useNavigation();
  const firstNameOfTreeDonator = request?.posts?.profiles?.first_name;

  const onCardPress = () => {
    if (request.approved) {
      navigation.navigate("Chat", {
        requestId: request.id,
        recipientProfile: request?.posts?.profiles,
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
              source={{
                uri: `${request?.posts?.image_url}?height=350&width=350`,
              }}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text>{firstNameOfTreeDonator}</Text>
            <Text>{dayjs(request.created_at).format("ll").toString()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            {request.approved ? (
              <Ionicons name="chatbubbles" color="green" size={40} />
            ) : (
              <Text
                style={{
                  color: "green",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  fontWeight: "600",
                }}
              >
                {t("requestByUserPendingButton")}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
