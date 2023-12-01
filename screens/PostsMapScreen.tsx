import React, { useCallback, useContext, useMemo, useState } from "react";
import { View, Text, Modal, SafeAreaView, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FeedPost } from "../components/feed/FeedPost";
import { usePosts } from "../hooks/use-posts";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../api/api";
import { SessionContext } from "../context/SessionContext";
import { useFocusEffect } from "@react-navigation/native";

const groupPostsByPostalCode = (posts: Post[]): Record<string, Post[]> => {
  const { session } = useContext(SessionContext);
  const { refetch } = usePosts(session?.user?.id!);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const groupedPosts: Record<string, Post[]> = {};

  posts.forEach((post) => {
    if (post.lat && post.lon) {
      const postalCode = post.postal_code;

      if (groupedPosts[postalCode]) {
        groupedPosts[postalCode].push(post);
      } else {
        groupedPosts[postalCode] = [post];
      }
    }
  });

  return groupedPosts;
};

const PostsMapScreen = () => {
  const { session } = useContext(SessionContext);
  const [offset, setOffset] = useState(4);
  const { data } = usePosts(session?.user?.id!);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPostalCode, setSelectedPostalCode] = useState("");
  const groupedPosts = groupPostsByPostalCode(data || []);

  const mappedData = useMemo(() => {
    return Object.keys(groupedPosts).map((postalCode) => {
      const postsForCurrentCode = groupedPosts[postalCode];

      const processedPosts = postsForCurrentCode.map((post) => {
        return { ...post };
      });

      return {
        postalCode: postalCode,
        posts: processedPosts,
      };
    });
  }, [groupedPosts]);

  const postList = mappedData
    ?.flatMap((entry) => entry.posts)
    ?.filter((post) => post?.postal_code === selectedPostalCode)
    ?.splice(0, offset);

  const onEndReached = () => {
    setOffset((prev) => prev + 4);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <MapView style={{ width: "100%", height: "100%" }} loadingEnabled={true}>
        {mappedData.map((entry) => (
          <Marker
            key={entry.postalCode}
            coordinate={{
              latitude: entry.posts[0].lat || 0,
              longitude: entry.posts[0].lon || 0,
            }}
            onPress={() => {
              setIsVisible(true);
              setSelectedPostalCode(entry.postalCode);
            }}
          >
            <Text style={{ fontSize: 20 }}>🎄</Text>
          </Marker>
        ))}
      </MapView>
      <Modal visible={isVisible}>
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <View
              style={{
                alignItems: "flex-end",
                paddingRight: 10,
              }}
            >
              <Ionicons
                name="close"
                size={30}
                onPress={() => setIsVisible(false)}
                style={{ paddingRight: 10 }}
              />
            </View>
            <FlatList
              data={postList}
              renderItem={({ item }) => (
                <FeedPost key={item.created_at.toString()} post={item} />
              )}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PostsMapScreen;
