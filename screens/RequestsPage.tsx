import React, { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import { useGetPostRequests } from "../hooks/use-requests";
import { SessionContext } from "../context/SessionContext";
import { PostRequest } from "../components/requests/PostRequest";

export const RequestsPage = () => {
  const { session } = useContext(SessionContext);
  const { requests} = useGetPostRequests(session?.user?.id!);

  if(!requests) {
    return <View><Text>You have no requests</Text></View>
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {requests?.map((req) => (
        <PostRequest key={req.id} request={req} />
      ))}
    </ScrollView>
  );
};
