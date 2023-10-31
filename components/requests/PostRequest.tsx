import { FC, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Request, approveRequest } from "../../api/api";
import { useApproveRequest } from "../../hooks/use-requests";
import { SessionContext } from "../../context/SessionContext";

interface RequestProps {
  request: Request;
}

export const PostRequest: FC<RequestProps> = ({ request }) => {
  const { session } = useContext(SessionContext);
  const { mutate } = useApproveRequest();
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
        onPress={() =>
          mutate({ requestId: request.id, userId: session?.user?.id! })
        }
      >
        <Text>{request.approved ? "approved" : "approve"}</Text>
      </Pressable>
    </View>
  );
};
