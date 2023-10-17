import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  ScrollView,
  RefreshControl,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { supabase } from "../utils/supabase";
import { useGetPosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/Post";

const HomePage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { posts } = useGetPosts(refreshing, setRefreshing);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="sign out" onPress={() => supabase.auth.signOut()} />
        <Text>{`Number of posts: ${posts.length}`}</Text>
      </View>
      {posts.map((post) => (
        <FeedPost key={post.created_at.toString()} post={post} />
      ))}
    </ScrollView>
  );
};

export default HomePage;