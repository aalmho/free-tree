import { FC, useCallback, useContext, useMemo } from "react";
import { Post } from "../../../api/api";
import { View, Text, TouchableOpacity } from "react-native";
import { SessionContext } from "../../../context/SessionContext";
import { useRequestTree } from "../../../hooks/use-requests";
import dayjs from "../../../dayjsWithLocale";
import { useDeletePost, useMarkPostAsReserved } from "../../../hooks/use-posts";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface InformationProps {
  post: Post;
}

export const Information: FC<InformationProps> = ({ post }) => {
  const { session } = useContext(SessionContext);
  const { t } = useTranslation();
  const { mutate: markTreeMutation, isPending: isMarkTreePending } =
    useMarkPostAsReserved();
  const { mutate: requestTreeMutation, isPending: isRequestPending } =
    useRequestTree();
  const { mutate: deleteTreeMutation, isPending: isDeletePending } =
    useDeletePost();

  const isUsersPost = useMemo(() => {
    return post.user_id === session?.user?.id;
  }, [post.user_id, session]);

  const isTreeRequestedByUser = useMemo(() => {
    return post.requests?.some(
      (request) => request.profiles?.id === session?.user.id
    );
  }, [post, session]);

  const toggleRequest = useCallback(() => {
    if (isUsersPost) {
      return deleteTreeMutation({ postId: post.id });
    }
    if (!isTreeRequestedByUser) {
      requestTreeMutation({
        requesterUserId: session?.user?.id!,
        postId: post.id,
      });
    }
  }, [post, session]);

  const postAction = useMemo(() => {
    if (isUsersPost) {
      return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="trash-outline" size={24} color="red" />
          <Text style={{ color: "red", fontWeight: "600" }}>
            {t("feedPostDelete")}
          </Text>
        </View>
      );
    }
    return isTreeRequestedByUser ? (
      <Text
        style={{
          color: "lightgreen",
          fontWeight: "600",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        {t("feedPostPending")}
      </Text>
    ) : (
      <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
        <Ionicons name="add-circle" size={32} color="green" />
        <Text style={{ color: "white", fontWeight: "600" }}>
          {t("feedPostRequestTree")}
        </Text>
      </View>
    );
  }, [isUsersPost, isTreeRequestedByUser]);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        paddingHorizontal: 5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backfaceVisibility: "visible",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          paddingLeft: 5,
          paddingTop: 5,
          marginBottom: 5,
          gap: 10,
          flex: 1,
        }}
      >
        <View>
          <Text style={{ color: "white", fontWeight: "800" }}>
            {t("postDescription")}
          </Text>
          <Text style={{ color: "lightgreen" }}>{post.description}</Text>
        </View>
        <View>
          <Text style={{ color: "white", fontWeight: "800" }}>
            {t("cpsDateOfPickUp")}
          </Text>
          <Text style={{ color: "lightgreen" }}>
            {dayjs(post.pick_up_date).format("ll").toString()}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center", gap: 5 }}>
        {isUsersPost && (
          <TouchableOpacity
            disabled={isMarkTreePending}
            style={{
              alignItems: "center",
            }}
            onPress={() =>
              markTreeMutation({ postId: post.id, mark: !post.reserved })
            }
          >
            {post.reserved ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Ionicons name="eye-off" size={32} color="green" />
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {t("unreserve")}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Ionicons name="eye" size={32} color="green" />
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {t("markAsReserved")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {
          <TouchableOpacity
            disabled={
              (isDeletePending || isRequestPending) && isTreeRequestedByUser
            }
            style={{
              alignItems: "center",
            }}
            onPress={() => toggleRequest()}
          >
            {postAction}
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};
