import { FC } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { RequestMadeByUser } from "../../api/api";
import dayjs from "../../locales";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface RequestByUserProps {
  request: RequestMadeByUser;
}

export const RequestByUser: FC<RequestByUserProps> = ({ request }) => {
  const navigation: NavigationProp<any> = useNavigation();

  const onCardPress = () => {
    if (request.approved) {
      navigation.navigate("Chat", { requestId: request.id });
    }
  };

  return (
    <TouchableOpacity onPress={() => onCardPress()}>
      <View
        style={{
          backgroundColor: "lightgrey",
          borderColor: "white",
          borderBottomWidth: 1,
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
              source={{ uri: request?.posts?.image_url }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text>{request?.posts?.profiles?.first_name}</Text>
            <Text>{dayjs(request.created_at).format("ll").toString()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            {request.approved ? (
              <Ionicons name="chatbubbles-sharp" color="green" size={40} />
            ) : (
              <Text
                style={{
                  color: "green",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                {"Pending"}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
