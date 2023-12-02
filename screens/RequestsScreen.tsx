import React, { useCallback, useContext } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import {
  useApproveRequest,
  useRequests,
  useRequestsByUser,
} from "../hooks/use-requests";
import { SessionContext } from "../context/SessionContext";
import { PostRequest } from "../components/requests/PostRequest";
import { RequestByUser } from "../components/requests/RequestByUser";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

const RequestsScreen = () => {
  const { t } = useTranslation();
  const { session } = useContext(SessionContext);
  const firstTimeRef = React.useRef(true);
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
  const { mutate: approveMutation, isPending: isApprovePending } =
    useApproveRequest();

  const refetchAllRequests = () => {
    refetch();
    refetchRequestsByUser();
  };

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetchAllRequests();
    }, [refetch, refetchRequestsByUser])
  );

  if (
    (!requests || !requests.length) &&
    (!requestsByUser?.length || !requestsByUser)
  ) {
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text>{t("requestsScreenNoRequests")} </Text>
        </View>
      </ScrollView>
    );
  }

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
      {!!requests?.length && (
        <View>
          <Text style={{ padding: 8, fontWeight: "800" }}>
            {t("requestsOfMyTrees")}
          </Text>
          {requests?.map((req) => (
            <PostRequest
              key={req.id}
              request={req}
              approveMutation={approveMutation}
              isApprovePending={isApprovePending}
            />
          ))}
        </View>
      )}
      {!!requestsByUser?.length && (
        <View>
          <Text style={{ padding: 8, fontWeight: "800" }}>
            {t("requestScreenMyRequests")}
          </Text>
          {requestsByUser?.map((req) => (
            <RequestByUser key={req.id} request={req} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default RequestsScreen;
