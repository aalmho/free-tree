import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FeedPost } from "../components/feed/FeedPost";
import { usePosts } from "../hooks/use-posts";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../api/api";

function groupPostsByPostalCode(posts: Post[]): Record<string, Post[]> {
  const groupedPosts: Record<string, Post[]> = {};

  posts.forEach((post) => {
    const postalCode = post.postal_code;

    if (groupedPosts[postalCode]) {
      groupedPosts[postalCode].push(post);
    } else {
      groupedPosts[postalCode] = [post];
    }
  });

  return groupedPosts;
}

const fetchAddressData = async (postalCode: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${postalCode}+dk`
    );
    return await response.json();
  } catch (error) {}
};

const PostsMapScreen = () => {
  const { data } = usePosts();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPostalCode, setSelectedPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mappedData, setMappedData] = useState<
    {
      postalCode: string;
      lat: any;
      lon: any;
      posts: Post[];
    }[]
  >([]);
  const groupedPosts = groupPostsByPostalCode(data || []);

  const fetchAndMapData = async () => {
    const promises = Object.keys(groupedPosts).map(async (postalCode) => {
      const postsForPostalCode = groupedPosts[postalCode];
      const mappedPosts = postsForPostalCode.map((post) => ({
        ...post,
      }));
      const data = await fetchAddressData(postalCode);
      const { lat, lon } = data[0];
      return {
        postalCode,
        lat,
        lon,
        posts: mappedPosts,
      };
    });

    return Promise.all(promises);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAndMapData().then((result) => {
      setMappedData(result);
      setIsLoading(false);
    });
  }, [data]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading && (
        <View style={{ height: 50 }}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} />}
          />
        </View>
      )}
      <MapView style={{ width: "100%", height: "100%" }} loadingEnabled={true}>
        {mappedData.map((entry) => (
          <Marker
            key={entry.postalCode}
            coordinate={{
              latitude: entry.lat,
              longitude: entry.lon,
            }}
            onPress={() => {
              setIsVisible(true);
              setSelectedPostalCode(entry.postalCode);
            }}
          >
            <Text>🎄</Text>
          </Marker>
        ))}
      </MapView>
      <Modal visible={isVisible}>
        <SafeAreaView style={{ height: "100%" }}>
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
