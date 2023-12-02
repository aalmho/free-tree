import { FC, useCallback, useContext, useMemo } from "react";
import { Post, createNotification } from "../../../api/api";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SessionContext } from "../../../context/SessionContext";
import dayjs from "../../../dayjsWithLocale";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { UseMutateFunction } from "@tanstack/react-query";

interface InformationProps {
  post: Post;
  hideTreeMutation?: UseMutateFunction<
    void,
    Error,
    {
      postId: number;
      mark: boolean;
      userId: string;
    },
    unknown
  >;
  isHideTreePending?: boolean;
  deleteTreeMutation?: UseMutateFunction<
    void,
    Error,
    {
      postId: number;
      userId: string;
    },
    unknown
  >;
  isDeletePending?: boolean;
  requestMutation?: UseMutateFunction<
    void,
    Error,
    {
      requesterUserId: string;
      postId: number;
    },
    unknown
  >;
  isRequestPending?: boolean;
}

export const Information: FC<InformationProps> = ({
  post,
  hideTreeMutation,
  isHideTreePending,
  deleteTreeMutation,
  isDeletePending,
  requestMutation,
  isRequestPending,
}) => {
  const { session } = useContext(SessionContext);
  const { t } = useTranslation();

  const isUsersPost = useMemo(() => {
    return post.user_id === session?.user?.id;
  }, [post.user_id, session]);

  const isTreeRequestedByUser = useMemo(() => {
    return post.requests?.some(
      (request) => request.profiles?.id === session?.user.id
    );
  }, [post, session]);

  const toggleRequest = useCallback(() => {
    if (isUsersPost && deleteTreeMutation) {
      return Alert.alert(t("deletePostTitle"), t("deletePostMessage"), [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("continue"),
          onPress: () =>
            deleteTreeMutation({ postId: post.id, userId: session?.user?.id! }),
        },
      ]);
    }
    if (!isTreeRequestedByUser && requestMutation) {
      requestMutation({ postId: post.id, requesterUserId: session?.user?.id! });
      createNotification(
        post.user_id,
        t("YourTreeIsRequestedNotificationTitle"),
        t("YourTreeIsRequestedNotificationBody")
      );
    }
  }, [post, session]);

  const postAction = useMemo(() => {
    if (isUsersPost) {
      return (
        <View
          style={{ backgroundColor: "lightgrey", borderRadius: 5, padding: 5 }}
        >
          <Ionicons name="trash-outline" size={20} color="black" />
        </View>
      );
    }
    return isTreeRequestedByUser ? (
      <Text
        style={{
          color: "green",
          fontWeight: "800",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        {t("feedPostPending")}
      </Text>
    ) : (
      <View
        style={{
          gap: 5,
          backgroundColor: "lightgrey",
          borderRadius: 5,
          padding: 5,
        }}
      >
        <Ionicons name="mail-outline" size={24} color="black" />
      </View>
    );
  }, [isUsersPost, isTreeRequestedByUser]);

  return (
    <View
      style={{
        paddingHorizontal: 5,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          paddingTop: 5,
          marginBottom: 5,
          gap: 10,
          flex: 1,
        }}
      >
        <View>
          <Text style={{ color: "black", fontWeight: "600", fontSize: 18 }}>
            {post.description}
          </Text>
        </View>
        <View>
          <Text style={{ color: "black", fontWeight: "800" }}>
            {t("cpsDateOfPickUp")}
          </Text>
          <Text style={{ color: "black" }}>
            {dayjs(post.pick_up_date).format("ll").toString()}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {isUsersPost && (
          <TouchableOpacity
            disabled={isHideTreePending}
            style={{
              alignItems: "center",
            }}
            onPress={() =>
              hideTreeMutation &&
              hideTreeMutation({
                postId: post.id,
                mark: !post.reserved,
                userId: session?.user?.id!,
              })
            }
          >
            {post.reserved ? (
              <View
                style={{
                  backgroundColor: "lightgrey",
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                <Ionicons name="eye-off-outline" size={20} color="black" />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "lightgrey",
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                <Ionicons name="eye-outline" size={20} color="black" />
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
