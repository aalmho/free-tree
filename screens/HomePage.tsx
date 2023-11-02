import React from "react";
import { View, Button, ScrollView, RefreshControl } from "react-native";
import { supabase } from "../utils/supabase";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";

const HomePage = () => {
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="sign out" onPress={() => supabase.auth.signOut()} />
      </View>
      {posts?.map((post) => (
        <FeedPost key={post.created_at.toString()} post={post} />
      ))}
    </ScrollView>
  );
};

export default HomePage;
