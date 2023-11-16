import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { SessionContext } from "../context/SessionContext";
import { Ionicons } from "@expo/vector-icons";
import {SignOutDropdown} from "../components/SignOutDropdown";

const MyPostsScreen = ({ navigation }: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: posts, isLoading, refetch, isRefetching } = usePosts();
  const { session } = useContext(SessionContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        name="menu-outline"
        color="green"
        size={30}
        style={{ paddingRight: 10 }}
      />
      ),
    });
  }, [navigation, isDropdownOpen]);

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
      {isDropdownOpen && <SignOutDropdown userId={session?.user?.id!} />}
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
