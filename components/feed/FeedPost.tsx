import { FC, useCallback, useContext, useMemo } from "react";
import { Post } from "../../api/api";
import { View, Image, Text, Pressable } from "react-native";
import { SessionContext } from "../../context/SessionContext";
import { useRequestTree } from "../../hooks/use-requests";
import dayjs from "dayjs";
import { useDeletePost } from "../../hooks/use-posts";

interface FeedPost {
  post: Post;
}

export const FeedPost: FC<FeedPost> = ({ post }) => {
  const { session } = useContext(SessionContext);
  const { mutate: requestTreeMutation } = useRequestTree();
  const { mutate: deleteTreeMutation } = useDeletePost();

  const isTreeRequested = useMemo(() => {
    return post.requests?.some(
      (request) => request.profiles?.id === session?.user.id
    );
  }, [post, session]);

  const isUsersPost = useMemo(() => {
    return post.user_id === session?.user?.id;
  }, [post.user_id, session]);

  const requestText = useMemo(() => {
    if (isUsersPost) {
      return "Delete";
    }
    return isTreeRequested ? "Pending" : "Request tree";
  }, [post, session]);

  const toggleRequest = useCallback(() => {
    if (isUsersPost) {
      return deleteTreeMutation({ postId: post.id });
    }
    if (!isTreeRequested) {
      requestTreeMutation({
        requesterUserId: session?.user?.id!,
        postId: post.id,
      });
    }
  }, [post, session]);

  return (
    <View style={{ marginHorizontal: 15, marginTop: 10 }}>
      <View
        style={{
          backgroundColor: "lightgrey",
          marginBottom: 15,
          borderRadius: 8,
          shadowOpacity: 1,
          shadowOffset: { width: 1, height: 1 },
        }}
      >
        <View
          style={{ width: "100%", height: 300 }}
          key={post.created_at.toString()}
        >
          <Image
            style={{
              height: "100%",
              resizeMode: "cover",
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
            }}
            source={{ uri: post.image_url }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: 5,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ paddingTop: 10, marginBottom: 15, gap: 10, flex: 1 }}>
            <Text>🎄 {post.description}</Text>
            <Text>📍 {`${post.postal_code}, ${post.city}`}</Text>
            <Text>
              🗓️ {dayjs(post.pick_up_date).format("DD MMM YYYY").toString()}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Pressable
              style={{
                backgroundColor: `${isUsersPost ? "red" : "green"}`,
                borderRadius: 24,
                minWidth: 100,
                alignItems: "center",
              }}
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
        </View>
      </View>
    </View>
  );
};
