import { FC, useCallback, useContext, useMemo } from "react";
import { Post } from "../../api/api";
import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import { SessionContext } from "../../context/SessionContext";
import { useRequestTree } from "../../hooks/use-requests";
import dayjs from "../../dayjsWithLocale";
import { useDeletePost, useMarkPostAsReserved } from "../../hooks/use-posts";
import { useTranslation } from "react-i18next";

interface FeedPost {
  post: Post;
}

export const FeedPost: FC<FeedPost> = ({ post }) => {
  const { t } = useTranslation();
  const { session } = useContext(SessionContext);
  const { mutate: requestTreeMutation, isPending: isRequestPending } =
    useRequestTree();
  const { mutate: deleteTreeMutation, isPending: isDeletePending } =
    useDeletePost();
  const { mutate: markTreeMutation, isPending: isMarkTreePending } =
    useMarkPostAsReserved();

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
      return t("feedPostDelete");
    }
    return isTreeRequested ? t("feedPostPending") : t("feedPostRequestTree");
  }, [post, session]);

  const toggleRequest = useCallback(() => {
    if (isUsersPost) {
      return Alert.alert(t("deletePostTitle"), "Vil du slette dette opslag", [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("continue"),
          onPress: () => deleteTreeMutation({ postId: post.id }),
        },
      ]);
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
            <Text>🗓️ {dayjs(post.pick_up_date).format("ll").toString()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center", gap: 5 }}>
            {isUsersPost && (
              <TouchableOpacity
                disabled={isMarkTreePending}
                style={{
                  backgroundColor: "green",
                  borderRadius: 24,
                  minWidth: 100,
                  alignItems: "center",
                }}
                onPress={() =>
                  markTreeMutation({ postId: post.id, mark: !post.reserved })
                }
              >
                <Text
                  style={{
                    color: "white",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                >
                  {post.reserved ? t("unreserve") : t("markAsReserved")}
                </Text>
              </TouchableOpacity>
            )}
            {requestText === t("feedPostPending") ? (
              <Text
                style={{
                  color: "green",
                  fontWeight: "600",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                {requestText}
              </Text>
            ) : (
              <TouchableOpacity
                disabled={isDeletePending || isRequestPending}
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
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
