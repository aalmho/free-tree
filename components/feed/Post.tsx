import { FC, useContext, useState } from "react";
import { Post, requestTree } from "../../api/api";
import { View, Image, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SessionContext } from "../../context/SessionContext";

interface FeedPost {
  post: Post;
}

export const FeedPost: FC<FeedPost> = ({ post }) => {
  const [treeRequested, setTreeRequested] = useState(false);
  const requestText = treeRequested ? "Tree requested" : "Request tree";
  const { session } = useContext(SessionContext);
  return (
    <View style={{ marginHorizontal: 15, marginTop: 10 }}>
      <View
        style={{
          backgroundColor: "lightgrey",
          marginBottom: 15,
          paddingHorizontal: 20,
          paddingTop: 20,
          borderRadius: 8,
        }}
      >
        <View
          style={{ width: "100%", height: 300 }}
          key={post.created_at.toString()}
        >
          <Image
            style={{ height: "100%", resizeMode: "cover", borderRadius: 8 }}
            source={{ uri: post.image_url }}
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Pressable
            style={{ backgroundColor: "green", borderRadius: 16, width: 150 }}
            onPress={() =>
              requestTree(session?.user?.id!, post.id)
            }
          >
            <Text
              style={{
                color: "white",
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              {requestText}
              {treeRequested && (
                <Ionicons name="checkmark" color="white" size={20} />
              )}
            </Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 5, marginBottom: 15 }}>
          <Text> {post.description}</Text>
        </View>
      </View>
    </View>
  );
};
