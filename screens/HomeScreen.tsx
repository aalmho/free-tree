import React from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";

const HomeScreen = () => {
  const { data: posts, isLoading, refetch, isRefetching } = usePosts();

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
      <View style={{ gap: 20 }}>
        {posts
          ?.filter((post) => !post.reserved)
          ?.map((post) => (
            <FeedPost key={post.created_at.toString()} post={post} />
          ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
