import { FC, useCallback, useContext, useMemo } from "react";
import { Post, requestTree, unrequestTree } from "../../api/api";
import { View, Image, Text, Pressable } from "react-native";
import { SessionContext } from "../../context/SessionContext";

interface FeedPost {
  post: Post;
}

export const FeedPost: FC<FeedPost> = ({ post }) => {
  const { session } = useContext(SessionContext);
  const isTreeRequested = useMemo(() => {
    return post.requests?.some(
      (request) => request.requester === session?.user.id
    );
  }, [post, session]);

  const requestText = useMemo(() => {
    if (post.user_id === session?.user?.id) {
      return "Your tree";
    }
    return isTreeRequested ? "Unrequest tree" : "Request tree";
  }, [post, session]);

  const toggleRequest = useCallback(() => {
    isTreeRequested
      ? unrequestTree(
          post.requests?.find(
            (request) => request.requester === session?.user?.id
          )?.id!
        )
      : requestTree(session?.user?.id!, post.id);
  }, [post, session]);

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
            onPress={() => toggleRequest()}
          >
            <Text
              style={{
                color: "white",
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              {requestText}
            </Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 5, marginBottom: 15 }}>
          <Text> {post.description}</Text>
          <Text> {post.pick_up_date?.toString()} </Text>
        </View>
      </View>
    </View>
  );
};
