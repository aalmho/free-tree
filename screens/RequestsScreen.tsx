import React, { useCallback, useContext, useMemo, useRef } from "react";
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
  const firstTimeRef = useRef(true);
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

  const requestsOfTrees = useMemo(() => requests, [requests, session]);
  const requestsByUsers = useMemo(
    () => requestsByUser,
    [requestsByUser, session]
  );

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

  const openedRow = useRef<Swipeable>(null);

  if (
    (!requestsOfTrees || !requestsOfTrees.length) &&
    (!requestsByUsers?.length || !requestsByUsers)
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
      {!!requestsOfTrees?.length && (
        <View>
          <Text style={{ padding: 8, fontWeight: "800" }}>
            {t("requestsOfMyTrees")}
          </Text>
          {requestsOfTrees?.map((req) => (
            <SwipeToDeleteRequest
              key={req.id}
              openedRow={openedRow}
              requestId={req.id}
              isRequestedByUser={false}
            >
              <PostRequest key={req.id} request={req} />
            </SwipeToDeleteRequest>
          ))}
        </View>
      )}
      {!!requestsByUsers?.length && (
        <View>
          <Text style={{ padding: 8, fontWeight: "800" }}>
            {t("requestScreenMyRequests")}
          </Text>
          {requestsByUsers?.map((req) => (
            <SwipeToDeleteRequest
              key={req.id}
              openedRow={openedRow}
              requestId={req.id!}
              isRequestedByUser
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
