import React, { useMemo } from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {
  const { data: posts, isLoading, refetch, isRefetching } = usePosts();
  const { t } = useTranslation();

  const unreservedTrees = useMemo(
    () => (posts || [])?.filter((post) => !post.reserved),
    [posts]
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
        <View style={{justifyContent: "center", padding: 20, alignItems: "center"}}>
          <Text>{t("noTreesPlaceholder")}</Text>
        </View>
      )}
      <View style={{ gap: 20 }}>
        {
          unreservedTrees?.map((post) => (
            <FeedPost key={post.created_at.toString()} post={post} />
          ))
        }
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
