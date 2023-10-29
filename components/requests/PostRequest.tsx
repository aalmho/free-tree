import { FC, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { Request, approveRequest, createChat } from "../../api/api";
import { SessionContext } from "../../context/SessionContext";

interface RequestProps {
  request: Request;
}

export const PostRequest: FC<RequestProps> = ({ request }) => {
  const { session } = useContext(SessionContext);

  const onClickApprove = () => {
    approveRequest(request.id);
    createChat(session?.user?.id! , 'aca88a6b-f908-4a2a-8690-05d46ec87c5f');
  }

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
        onPress={() => onClickApprove()}
      >
        <Text>Approve</Text>
      </Pressable>
    </View>
  );
};
