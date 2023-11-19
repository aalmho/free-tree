import { FC, useContext } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { RequestWithImg, useApproveRequest } from "../../hooks/use-requests";
import { SessionContext } from "../../context/SessionContext";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface RequestProps {
  request: RequestWithImg;
}

export const PostRequest: FC<RequestProps> = ({ request }) => {
  const { session } = useContext(SessionContext);
  const { mutate, isPending } = useApproveRequest();
  const { t } = useTranslation();
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
            source={{ uri: request?.image_url }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text>{request?.profiles?.first_name}</Text>
          <Text>
            {dayjs(request.created_at).format("DD MMM YYYY").toString()}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          {request.approved ? (
            <Ionicons name="chatbubbles-sharp" color="green" size={40} />
          ) : (
            <Pressable
              disabled={isPending}
              style={{
                backgroundColor: "green",
                borderRadius: 24,
                minWidth: 100,
                alignItems: "center",
              }}
              onPress={() =>
                mutate({ requestId: request.id!, userId: session?.user?.id! })
              }
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
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};
