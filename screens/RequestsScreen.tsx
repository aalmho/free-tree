import React, { useContext } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useRequests, useRequestsByUser } from "../hooks/use-requests";
import { SessionContext } from "../context/SessionContext";
import { PostRequest } from "../components/requests/PostRequest";
import { RequestByUser } from "../components/requests/RequestByUser";

const RequestsScreen = () => {
  const { session } = useContext(SessionContext);
  const {
    data: requests,
    isLoading,
    isRefetching,
    refetch,
  } = useRequests(session?.user?.id!);
  const {
    data: requestsByUser,
    isLoading: isRequestByUserLoading,
    isRefetching: isRequestByUserFetching,
    refetch: refetchRequestsByUser,
  } = useRequestsByUser(session?.user?.id!);
  if (
    (!requests || !requests.length) &&
    (!requestsByUser?.length || !requestsByUser)
  ) {
    return (
      <View>
        <Text>You have no requests</Text>
      </View>
    );
  }

  const refetchAllRequests = () => {
    refetch();
    refetchRequestsByUser();
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={
            isLoading ||
            isRefetching ||
            isRequestByUserFetching ||
            isRequestByUserLoading
          }
          onRefresh={refetchAllRequests}
        />
      }
    >
      {requests?.length === 0 && requestsByUser?.length === 0 && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ padding: 8 }}>
            Create a post or request a tree to see your requests
          </Text>
        </View>
      )}
      {!!requests?.length && (
        <View>
          <Text style={{ padding: 8 }}>Requests of my trees</Text>
          {requests?.map((req) => (
            <PostRequest key={req.id} request={req} />
          ))}
        </View>
      )}
      {!!requestsByUser?.length && (
        <View>
          <Text style={{ padding: 8 }}>My requests</Text>
          {requestsByUser?.map((req) => (
            <RequestByUser key={req.id} request={req} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default RequestsScreen;
