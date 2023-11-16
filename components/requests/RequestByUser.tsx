import { FC } from "react";
import { View, Text, Image } from "react-native";
import { RequestMadeByUser } from "../../api/api";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";

interface RequestByUserProps {
  request: RequestMadeByUser;
}

export const RequestByUser: FC<RequestByUserProps> = ({ request }) => {
  return (
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
          <Text>
            {dayjs(request.created_at).format("DD MMM YYYY").toString()}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {request.approved ? (
            <Ionicons name="chatbubbles-sharp" color="green" size={40} />
          ) : (
            <Text
              style={{
                color: "green",
                fontWeight: "600",
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              Afventer
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
