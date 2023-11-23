import React, { useMemo, useState } from "react";
import { View, Text, Modal, ScrollView, SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FeedPost } from "../components/feed/FeedPost";
import { usePosts } from "../hooks/use-posts";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../api/api";

const groupPostsByPostalCode = (posts: Post[]): Record<string, Post[]> => {
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
  const { data } = usePosts();
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
    })
  }, [groupedPosts])

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
          <ScrollView>
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
            <View
              style={{
                gap: 20,
              }}
            >
              {mappedData.map((entry) =>
                entry.posts
                  .filter((post) => post.postal_code === selectedPostalCode)
                  .map((post) => <FeedPost key={post.id} post={post} />)
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PostsMapScreen;
