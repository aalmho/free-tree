import React, { useCallback, useContext, useMemo } from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../context/SessionContext";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const { session } = useContext(SessionContext);
  const { data: posts, isLoading, refetch, isRefetching } = usePosts();
  const { t } = useTranslation();

  const unreservedTrees = useMemo(
    () => (posts || [])?.filter((post) => !post.reserved),
    [posts]
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isRefetching}
          onRefresh={refetch}
        />
      }
    >
      {unreservedTrees?.length === 0 && (
        <View
          style={{
            justifyContent: "center",
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text>{t("noTreesPlaceholder")}</Text>
        </View>
      )}
      <View style={{ gap: 20 }}>
        {unreservedTrees
          ?.filter((post) => post.user_id !== session?.user?.id)
          ?.map((post) => (
            <FeedPost key={post.created_at.toString()} post={post} />
          ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
