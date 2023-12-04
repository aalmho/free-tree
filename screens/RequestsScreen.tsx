import React, { useCallback, useContext, useRef } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useRequests, useRequestsByUser } from "../hooks/use-requests";
import { SessionContext } from "../context/SessionContext";
import { PostRequest } from "../components/requests/PostRequest";
import { RequestByUser } from "../components/requests/RequestByUser";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import SwipeToDeleteRequest from "../components/requests/SwipeToDeleteRequest";
import { deleteRequestById } from "../api/api";
import { Swipeable } from "react-native-gesture-handler";

const RequestsScreen = () => {
  const { t } = useTranslation();
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

  const refetchAllRequests = () => {
    refetch();
    refetchRequestsByUser();
  };

  useFocusEffect(
    useCallback(() => {
      refetchAllRequests();
    }, [])
  );

  const openedRow = useRef<Swipeable>(null);
  const deleteRequest = async (requestId: number, refetch: () => void) => {
    await deleteRequestById(requestId);
    refetch();
  };

  if (
    (!requests || !requests.length) &&
    (!requestsByUser?.length || !requestsByUser)
  ) {
    return (
      <View
        style={{ justifyContent: "center", alignItems: "center", padding: 20 }}
      >
        <Text>{t("requestsScreenNoRequests")} </Text>
      </View>
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
            {t("requestsOfMyTrees")}{" "}
          </Text>
          {requests?.map((req) => (
            <SwipeToDeleteRequest
              key={req.id}
              openedRow={openedRow}
              deleteRequest={() => deleteRequest(req.id!, refetch)}
            >
              <PostRequest key={req.id} request={req} />
            </SwipeToDeleteRequest>
          ))}
        </View>
      )}
      {!!requestsByUser?.length && (
        <View>
          <Text style={{ padding: 8, fontWeight: "800" }}>
            {t("requestScreenMyRequests")}{" "}
          </Text>
          {requestsByUser?.map((req) => (
            <SwipeToDeleteRequest
              key={req.id}
              openedRow={openedRow}
              deleteRequest={() =>
                deleteRequest(req.id!, refetchRequestsByUser)
              }
            >
              <RequestByUser key={req.id} request={req} />
            </SwipeToDeleteRequest>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default RequestsScreen;
