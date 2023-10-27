import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { Request, approveRequest } from "../../api/api";

interface RequestProps {
  request: Request;
}

export const PostRequest: FC<RequestProps> = ({ request }) => {
  return (
    <View style={{ marginHorizontal: 15, marginTop: 10 }}>
      <Text>{`post id: ${request.post_id}`}</Text>
      <Text>
        {request.approved
          ? "Request is approved"
          : "Request is not yet approved"}
      </Text>
      <Pressable
        style={{
          backgroundColor: "green",
          borderRadius: 16,
          width: 100,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => approveRequest(request.id)}
      >
        <Text>Approve</Text>
      </Pressable>
    </View>
  );
};
