import React, { useContext } from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { SessionContext } from "../context/SessionContext";
import { Ionicons } from "@expo/vector-icons";

const MyPostsScreen = ({navigation}: any) => {
  const { data: posts, isLoading, refetch, isRefetching } = usePosts();
  const { session } = useContext(SessionContext);
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 30,
          }}
        >
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
            onPress={() => navigation.navigate("CreatePostScreen")}
          >
            <Ionicons
              name="add-circle"
              color="green"
              size={70}
              style={{ position: "absolute" }}
            />
          </Pressable>
        </View>
      <View style={{ gap: 20 }}>
        {posts
          ?.filter((post) => post.user_id === session?.user?.id)
          .map((post) => (
            <FeedPost key={post.created_at.toString()} post={post} />
          ))}
      </View>
      </View>
    </ScrollView>
  );
};

export default MyPostsScreen;
