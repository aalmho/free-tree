import React, { useCallback, useContext, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../context/SessionContext";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const { session } = useContext(SessionContext);
  const { data: posts, isLoading, refetch } = usePosts(session?.user?.id!);
  const { t } = useTranslation();
  const [offset, setOffset] = useState(4);

  const postList = posts?.slice(0, offset);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const onEndReached = () => {
    setOffset((prev) => prev + 4);
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View>
        {postList?.length === 0 && (
          <View
            style={{
              justifyContent: "center",
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text>{t("noTreesPlaceholder")}</Text>
          </View>
        )}
      </View>
      <View>
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
    </>
  );
};

export default HomeScreen;
